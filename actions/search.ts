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

    while (!rawLabelString || cleanedLabels.length === 0) {
      const prompt: string = constructPromptForImageSearch({ gender });

      rawLabelString = await sendImgURLAndPromptToGPT({
        model,
        prompt,
        imageUrl,
      });
      // console.log("the raw label = ", rawLabelString);
      if (rawLabelString) {
        cleanedLabels = validateLabelString(rawLabelString);
      }
      console.log("Image Search recommendation: ", cleanedLabels);

      if (!rawLabelString || cleanedLabels.length === 0) {
        console.warn("Retrying sendImgURLAndPromptToGPT due to invalid results...");
      }
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

    while (!rawLabelString || cleanedLabels.length === 0) {
      const prompt: string = constructPromptForTextSearch({
        query,
        gender,
      });

      rawLabelString = await sendPromptToGPT({
        model,
        prompt,
      });
      // console.log("the raw label = ", rawLabelString);
      if (rawLabelString) {
        cleanedLabels = validateLabelString(rawLabelString);
      }
      console.log("Text Search recommendation: ", cleanedLabels);

      if (!rawLabelString || cleanedLabels.length === 0) {
        console.warn("Retrying sendPromptToGPT due to invalid results...");
      }
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
  priceLowerBound?: number,
  priceUpperBound?: number,
  providers?: string[],
  clothingType?: ClothingType,
  user_id?: string,
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
