"use server";
import prisma from "@/prisma/db";
import { UnstoredResult, ValidatedRecommendation } from "@/type";
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
  semanticSearchForRecommendation
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
  userId: string | null,
  numMaxSuggestion: number,
  numMaxItem: number,
  imageUrl: string
): Promise<string | null> => {
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
        return "";
      }
      console.log(`handleRecommendation while loop at iteration ${attempts}`);
      const prompt = constructPromptForRecommendation({ clothingType, gender, numMaxSuggestion });
      console.log('flag1');
      recommendations = await sendImgURLAndPromptToGPT({ model, prompt, imageUrl });
      console.log('flag2');
      
      if (!recommendations) continue;
      
      cleanedRecommendations = validateLabelString(recommendations, clothingType);
      attempts++;
    }
    console.log('flag3');
    const uploadId: number = await insertUpload(imageUrl, userId);
    console.log('flag4');
    const paramId: number = await insertParam(gender, clothingType, model);
    console.log('flag5');
    const recommendationId: string = await insertRecommendation({
      paramId,
      uploadId,
      userId,
    });
    console.log('flag6');
    
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
    console.log('flag7');
    
    return recommendationId;
  } catch (error) {
    handleDatabaseError(error, "handleRecommendation");
    return null;
  }
};

const stopAction = async (recommendationId: string) => {
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

export { handleRecommendation, stopAction };

