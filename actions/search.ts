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
): Promise<{ labelString: string; clothing_type?: ClothingType }> => {
  try {
    let rawLabelString: string | null = null;
    let cleanedLabels: ValidatedRecommendation[] = [];
    const maxRetries = 5;
    let attempts = 0;
    let detectedClothingType: ClothingType | undefined;

    while (rawLabelString?.length === 0 || cleanedLabels.length === 0) {
      if (attempts >= maxRetries) {
        console.error("Max retries reached for image search.");
        return { labelString: "", clothing_type: undefined };
      }

      const prompt: string = constructPromptForImageSearch({ gender });
      rawLabelString = await sendImgURLAndPromptToGPT({
        model,
        prompt,
        imageUrl,
      });
      console.log("get gpt rec: ", rawLabelString);
      if (rawLabelString) {
        let clothingTypeString = rawLabelString;
        if (typeof clothingTypeString !== "string") {
          console.log("Recommendations is not a string:", clothingTypeString);
          rawLabelString = null;
          continue;
        }
    
        const cleanedClothingType = clothingTypeString.replace(/```json\s*|\s*```/g, "").trim();
    
        if (!cleanedClothingType.startsWith("[")) {
          console.log("Cleaned recommendations does not start with '[':", cleanedClothingType);
          rawLabelString = null;
          continue;
        }
        try {
          const parsedData = JSON.parse(cleanedClothingType)[0];
          detectedClothingType =
            parsedData.clothing_type === "上半身" ? "top" :
            parsedData.clothing_type === "下半身" ? "bottom" :
            undefined;
          console.log("parsed clothing type: ", parsedData.clothing_type);
          cleanedLabels = validateLabelString(rawLabelString, true, detectedClothingType);
        } catch (parseError) {
          console.error("Failed to parse rawLabelString JSON:", parseError);
          detectedClothingType = undefined;
        }
      }

      console.log("Image Search recommendation: ", cleanedLabels);

      if (rawLabelString?.length === 0 || cleanedLabels.length === 0) {
        console.warn("Retrying sendImgURLAndPromptToGPT due to invalid results...");
      }
      attempts++;
    }
    return {
      labelString: cleanedLabels[0]?.labelString || "",
      clothing_type: detectedClothingType,
    };
  } catch (error) {
    handleDatabaseError(error, "getLabelStringForImageSearch");
    return { labelString: "", clothing_type: undefined };
  }
};

const getLabelStringForTextSearch = async (
  gender: Gender,
  model: string,
  query: string,
): Promise<{ labelString: string; clothing_type?: ClothingType }> => {
  try {
    let rawLabelString: string | null = null;
    let cleanedLabels: ValidatedRecommendation[] = [];
    const maxRetries = 5;
    let attempts = 0;
    let detectedClothingType: ClothingType | undefined;

    while (rawLabelString?.length === 0 || cleanedLabels.length === 0) {
      if (attempts >= maxRetries) {
        console.error("Max retries reached for text search.");
        return { labelString: "", clothing_type: undefined };
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
        let clothingTypeString = rawLabelString;
        if (typeof clothingTypeString !== "string") {
          console.log("Recommendations is not a string:", clothingTypeString);
          rawLabelString = null;
          continue;
        }

        const cleanedClothingType = clothingTypeString.replace(/```json\s*|\s*```/g, "").trim();

        if (!cleanedClothingType.startsWith("[")) {
          console.log("Cleaned recommendations does not start with '[':", cleanedClothingType);
          rawLabelString = null;
          continue;
        }

        try {
          const parsedData = JSON.parse(cleanedClothingType)[0];
          detectedClothingType =
            parsedData.clothing_type === "上半身" ? "top" :
            parsedData.clothing_type === "下半身" ? "bottom" :
            undefined;
          cleanedLabels = validateLabelString(rawLabelString, true, detectedClothingType);
        } catch (parseError) {
          console.error("Failed to parse rawLabelString JSON:", parseError);
          detectedClothingType = undefined;
        }
      }

      if (rawLabelString?.length === 0 || cleanedLabels.length === 0) {
        console.warn("Retrying sendPromptToGPT due to invalid results...");
      }
      attempts++;
    }

    return {
      labelString: cleanedLabels[0]?.labelString || "",
      clothing_type: detectedClothingType,
    };
  } catch (error) {
    handleDatabaseError(error, "getLabelStringForTextSearch");
    return { labelString: "", clothing_type: undefined };
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
