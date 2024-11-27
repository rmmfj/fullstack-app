"use server";
import { SearchResult, ValidatedRecommendation } from "@/type";
import { handleDatabaseError } from "./activity";
import { sendImgURLAndPromptToGPT, sendPromptToGPT } from "./utils/chat";
import {
  semanticSearchForSearching
} from "./utils/matching";
import {
  constructPromptForImageSearch,
  constructPromptForTextSearch,
} from "./utils/prompt";
import { validateLabelString } from "./utils/validate";

import { ClothingType, Gender } from "@/type";

const getLabelStringForImageSearch = async (
  gender: Gender,
  model: string,
  imageUrl: string
): Promise<string> => {
  try {
    let rawLabelString: string | null = null;
    let cleanedLabels: ValidatedRecommendation[] = [];
    const maxRetries = 5;
    let attempts = 0;

    while (rawLabelString?.length === 0 || cleanedLabels.length === 0) {
      if (attempts >= maxRetries) {
        console.error("Max retries reached for image search.");
        return "";
      }
      const prompt: string = constructPromptForImageSearch({ gender });
      rawLabelString = await sendImgURLAndPromptToGPT({
        model,
        prompt,
        imageUrl,
      });
      if (rawLabelString) {
        cleanedLabels = validateLabelString(rawLabelString);
      }
      console.log("Image Search recommendation: ", cleanedLabels);

      if (rawLabelString?.length === 0 || cleanedLabels.length === 0) {
        console.warn("Retrying sendImgURLAndPromptToGPT due to invalid results...");
      }
      attempts++;
    }

    return cleanedLabels[0].labelString;
  } catch (error) {
    handleDatabaseError(error, "getLabelStringForImageSearch");
    return "";
  }
};

const getLabelStringForTextSearch = async (
  gender: Gender,
  model: string,
  query: string,
): Promise<string> => {
  try {
    let rawLabelString: string | null = null;
    let cleanedLabels: ValidatedRecommendation[] = [];
    const maxRetries = 5;
    let attempts = 0;

    while (rawLabelString?.length === 0 || cleanedLabels.length === 0) {
      if (attempts >= maxRetries) {
        console.error("Max retries reached for text search.");
        return "";
      }
      const prompt: string = constructPromptForTextSearch({
        query,
        gender,
      });

      rawLabelString = await sendPromptToGPT({
        model,
        prompt,
      });
      if (rawLabelString) {
        cleanedLabels = validateLabelString(rawLabelString);
      }

      if (rawLabelString?.length === 0 || cleanedLabels.length === 0) {
        console.warn("Retrying sendPromptToGPT due to invalid results...");
      }
      attempts++;
    }

    return cleanedLabels[0].labelString;
  } catch (error) {
    handleDatabaseError(error, "getLabelStringForTextSearch");
    return "";
  }
};

const handleSearch = async (
  labelString: string,
  gender: Gender,
  page: number,
  user_id: string | null,
  priceLowerBound?: number,
  priceUpperBound?: number,
  providers?: string[],
  clothingType?: ClothingType,
): Promise<SearchResult | null> => {
  try {
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
    console.log("handle searsh searchResult: ", searchResult);
    return searchResult;
  } catch (error) {
    handleDatabaseError(error, "handleImageSearch");
    return null;
  }
};

export { getLabelStringForImageSearch, getLabelStringForTextSearch, handleSearch };
