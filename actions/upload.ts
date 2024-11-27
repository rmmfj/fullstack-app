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
    console.time("checkpoint 0");
    console.time("checkpoint 1");
    let recommendations: string | null = null;
    let cleanedRecommendations: ValidatedRecommendation[] = [];
    const maxRetries = 5;
    let attempts = 0;
    console.timeEnd("checkpoint 1");

    console.time("checkpoint 2");
    while (recommendations?.length === 0 || cleanedRecommendations.length === 0) {
      if (attempts >= maxRetries) {
        console.error("Max retries reached for handling recommendation.");
        return -1;
      }
      console.log(`handleRecommendation while loop at iteration ${attempts}`);
      const prompt = constructPromptForRecommendation({ clothingType, gender, numMaxSuggestion });
      recommendations = await sendImgURLAndPromptToGPT({ model, prompt, imageUrl });

      if (!recommendations) continue;

      cleanedRecommendations = validateLabelString(recommendations, clothingType);
      attempts++;
    }
    console.timeEnd("checkpoint 2");

    console.time("checkpoint 3");
    const uploadId: number = await insertUpload(imageUrl, userId);
    const paramId: number = await insertParam(gender, clothingType, model);
    const recommendationId: number = await insertRecommendation({
      paramId,
      uploadId,
      userId,
    });
    console.timeEnd("checkpoint 3");

    console.time("checkpoint 4");
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

    console.timeEnd("checkpoint 4");
    console.timeEnd("checkpoint 0");
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
    const maxRetries = 5;
    let attempts = 0;

    while (rawLabelString?.length === 0 || cleanedLabels.length === 0) {
      if (attempts >= maxRetries) {
        console.error("Max retries reached for hendling recommendation without login.");
        return null;
      }
      console.log(`handleRecommendationWithoutLogin while loop at iteration ${attempts}`);
      const prompt = constructPromptForRecommendation({ clothingType, gender, numMaxSuggestion });
      rawLabelString = await sendImgURLAndPromptToGPT({ model, prompt, imageUrl });

      if (rawLabelString) {
        cleanedLabels = validateLabelString(rawLabelString, clothingType);
      }
      console.log("GPT recommendations= ", cleanedLabels);

      if (rawLabelString?.length === 0 || cleanedLabels.length === 0) {
        console.warn("Retrying sendImgURLAndPromptToGPT due to invalid results...");
      }
      attempts++;
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
        return null;
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

