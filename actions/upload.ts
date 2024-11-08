"use server";
import { RecommendationWithoutLogin, SearchResult, UnstoredResult } from "@/type";
import { handleDatabaseError } from "./activity";
import { sendImgURLAndPromptToGPT, sendPromptToGPT } from "./utils/chat";
import {
  insertParam,
  insertRecommendation,
  insertResults,
  insertSuggestion,
  insertUpload,
} from "./utils/insert";
import {
  semanticSearchForRecommendation,
  semanticSearchForSearching,
  semanticSearchWithoutLogin
} from "./utils/matching";
import {
  constructPromptForImageSearch,
  constructPromptForRecommendation,
  constructPromptForTextSearch,
} from "./utils/prompt";
import { validateLabelString } from "./utils/validate";

import { ClothingType, Gender } from "@/type";

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
    const prompt = constructPromptForRecommendation({ clothingType, gender, numMaxSuggestion });
    const recommendations = await sendImgURLAndPromptToGPT({ model, prompt, imageUrl });

    if (!recommendations) return -1;

    const cleanedRecommendations = validateLabelString(recommendations, clothingType);
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
): Promise<RecommendationWithoutLogin[] | null> => {
  try {
    const prompt = constructPromptForRecommendation({ clothingType, gender, numMaxSuggestion });
    const rawLabelString: string | null = await sendImgURLAndPromptToGPT({ model, prompt, imageUrl });

    if (rawLabelString) {
      const cleanedLabels = validateLabelString(rawLabelString, clothingType);

      if (cleanedLabels.length > 0) {
        const recommendations: RecommendationWithoutLogin[] = [];

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
            const recommendation: RecommendationWithoutLogin = {
              clothing_type: clothingType,
              gender: gender,
              model: model,
              image_url: imageUrl,
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
      } else {
        console.error("No valid labels found after cleaning");
        return null;
      }
    } else {
      console.error("No label string returned from GPT");
      return null;
    }
  } catch (error) {
    handleDatabaseError(error, "handleRecommendationWithoutLogin");
    return null;
  }
};

const handleImageSearch = async (
  gender: Gender,
  model: string,
  imageUrl: string,
  page: number,
  priceLowerBound?: number,
  priceUpperBound?: number,
  providers?: string[],
  clothingType?: ClothingType,
  user_id?: string,
): Promise<SearchResult | null> => {
  try {
    const prompt: string = constructPromptForImageSearch({
      gender,
    });

    const rawLabelString: string | null = await sendImgURLAndPromptToGPT({
      model,
      prompt,
      imageUrl,
    });

    if (rawLabelString) {
      const cleanedLabels = validateLabelString(rawLabelString);

      if (cleanedLabels.length > 0) {
        const labelString = cleanedLabels[0].labelString;
        const searchResult: SearchResult | null = await semanticSearchForSearching({
          suggestedLabelString: labelString,
          gender,
          priceLowerBound,
          priceUpperBound,
          providers,
          clothingType,
          page,
          user_id,
        });
        console.log("searchResult: ", searchResult);
        return searchResult;
      } else {
        console.error("No valid labels found after cleaning");
        return null;
      }
    } else {
      console.error("No label string returned from GPT");
      return null;
    }
  } catch (error) {
    handleDatabaseError(error, "handleImageSearch");
    return null;
  }
};

const handleTextSearch = async (
  query: string,
  model: string,
  gender: Gender,
  page: number,
  priceLowerBound?: number,
  priceUpperBound?: number,
  providers?: string[],
  clothingType?: ClothingType,
  user_id?: string,
): Promise<SearchResult | null> => {
  try {
    const prompt: string = constructPromptForTextSearch({
      query,
      gender,
    });

    const rawLabelString: string | null = await sendPromptToGPT({
      model,
      prompt,
    });

    if (rawLabelString) {
      const cleanedLabels = validateLabelString(
        rawLabelString,
      );

      if (cleanedLabels.length > 0) {
        const labelString = cleanedLabels[0].labelString;

        const searchResult: SearchResult | null =
          await semanticSearchForSearching({
            suggestedLabelString: labelString,
            gender,
            priceLowerBound,
            priceUpperBound,
            providers,
            clothingType,
            page,
            user_id
          });

        return searchResult;
      } else {
        console.error("No valid labels found after cleaning");
        return null;
      }
    } else {
      console.error("No label string returned from GPT");
      return null;
    }
  } catch (error) {
    handleDatabaseError(error, "handleTextSearch");
    return null;
  }
};

export { handleImageSearch, handleRecommendation, handleRecommendationWithoutLogin, handleTextSearch };

