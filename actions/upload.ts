"use server";
import prisma from "@/prisma/db";
import { Recommendation, UnstoredResult, ValidatedRecommendation } from "@/type";
import { handleDatabaseError } from "./activity";
import { sendImgURLAndPromptToGPT } from "./utils/chat";
import {
  insertParam,
  insertRecommendation,
  insertResults,
  insertSuggestion,
  insertUpload,
} from "./utils/insert";
import {
  semanticSearchForRecommendation,
  semanticSearchWithoutLogin
} from "./utils/matching";
import {
  constructPromptForRecommendation,
} from "./utils/prompt";
import { validateLabelString } from "./utils/validate";

import { ClothingType, Gender } from "@/type";
import { deleteParamById, deleteUploadById } from "./utils/delete";

const handleRecommendation = async (
  clothingType: ClothingType,
  gender: Gender,
  model: string,
  userId: string,
  numMaxSuggestion: number,
  numMaxItem: number,
  imageUrl: string
): Promise<number> => {
  try {
    let recommendations: string | null = null;
    let cleanedRecommendations: ValidatedRecommendation[] = [];

    while (recommendations?.length === 0 || cleanedRecommendations.length === 0) {
      const prompt = constructPromptForRecommendation({ clothingType, gender, numMaxSuggestion });
      recommendations = await sendImgURLAndPromptToGPT({ model, prompt, imageUrl });

      if (!recommendations) continue;
      // console.log("before label string = ", recommendations);

      cleanedRecommendations = validateLabelString(recommendations, clothingType);
      // console.log("得到的 clothing_type = ", clothingType);
      // console.log("GPT recommendations= ", cleanedRecommendations);
    }
    const uploadId: number = await insertUpload(imageUrl, userId);
    const paramId: number = await insertParam(gender, clothingType, model);
    const recommendationId: number = await insertRecommendation({
      paramId,
      uploadId,
      userId,
    });

    await Promise.all(cleanedRecommendations.map(async (rec) => {
      const suggestionId = await insertSuggestion({
        recommendationId,
        labelString: rec.labelString,
        styleName: rec.styleName,
        description: rec.description,
      });
      
      const results = await semanticSearchForRecommendation({
        suggestionId,
        suggestedLabelString: rec.labelString,
        numMaxItem,
        gender,
        clothing_type: clothingType,
      });
      await insertResults(results as UnstoredResult[]);
      return 0;
    }));

    return recommendationId;
  } catch (error) {
    handleDatabaseError(error, "handleRecommendation");
    return -1;
  }
};

const handleRecommendationWithoutLogin = async (
  clothingType: ClothingType,
  gender: Gender,
  model: string,
  numMaxSuggestion: number,
  numMaxItem: number,
  imageUrl: string
): Promise<Recommendation[] | null> => {
  try {
    let rawLabelString: string | null = null;
    let cleanedLabels: ValidatedRecommendation[] = [];

    while (!rawLabelString || cleanedLabels.length === 0) {
      const prompt = constructPromptForRecommendation({ clothingType, gender, numMaxSuggestion });
      rawLabelString = await sendImgURLAndPromptToGPT({ model, prompt, imageUrl });

      if (rawLabelString) {
        cleanedLabels = validateLabelString(rawLabelString, clothingType);
      }
      console.log("GPT recommendations= ", cleanedLabels);

      if (!rawLabelString || cleanedLabels.length === 0) {
        console.warn("Retrying sendImgURLAndPromptToGPT due to invalid results...");
      }
    }
    const recommendations: Recommendation[] = [];

    for (const cleanedLabel of cleanedLabels) {
      const labelString = cleanedLabel.labelString;
      const description = cleanedLabel.description;

      const results = await semanticSearchWithoutLogin({
        suggestedLabelString: labelString,
        numMaxItem,
        gender,
        clothing_type: clothingType,
      });

      if (results) {
        const recommendation: Recommendation = {
          clothingType: clothingType,
          gender: gender,
          model: model,
          imageUrl: imageUrl,
          styles: {
            default: {
              series: results,
              description: description,
            },
          },
        };
        recommendations.push(recommendation);
      } else {
        console.error("No results found in semanticSearchWithoutLogin for label:", labelString);
      }
    }

    return recommendations;
  } catch (error) {
    handleDatabaseError(error, "handleRecommendationWithoutLogin");
    return null;
  }
};

const stopAction = async (recommendationId: number) => {
  try {
    const suggestions = await prisma.suggestion.findMany({
      where: { recommendation_id: recommendationId },
      select: { id: true },
    });
    const suggestionIds = suggestions.map((s) => s.id);

    await prisma.result.deleteMany({
      where: { suggestion_id: { in: suggestionIds } },
    });

    await prisma.suggestion.deleteMany({
      where: { id: { in: suggestionIds } },
    });

    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
      select: { param_id: true, upload_id: true },
    });

    if (!recommendation) {
      console.error("Recommendation not found");
      return;
    }

    const { param_id: paramId, upload_id: uploadId } = recommendation;

    await prisma.recommendation.delete({
      where: { id: recommendationId },
    });

    if (paramId) await deleteParamById(paramId);
    if (uploadId) await deleteUploadById(uploadId);
  } catch (error) {
    handleDatabaseError(error, 'bruteForceAction');
  }
};

export { handleRecommendation, handleRecommendationWithoutLogin, stopAction };

