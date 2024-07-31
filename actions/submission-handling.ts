// process-handler.ts
import {
  extractLabelsFromImage,
  validateResponseFormat,
} from "./image-labeling";
import { semanticSearch } from "./outfit-matching";
import { chatCompletionTextAndImage, chatCompletionTextOnly } from "./utils";
import { getItemsByIds } from "./item";
import { ClothingType, ItemTable, ResultTable } from "@/type";
import { ImageURL } from "openai/resources/beta/threads/messages";
import { v4 as uuidv4 } from "uuid";
import { insertParam, insertUpload } from "./user-input";
import { insertRecommendation, insertResults, insertSuggestion } from "./recommendation";
import { string } from "zod";

const handleSuggestionMatching = async (
  suggested_label_strings: string[],
  max_num_item: number,
  recommendation_id: number
) => {
  try {
    for (const s of suggested_label_strings) {
      // store suggetions and get suggestion_ids
      const suggestion_id: number = await insertSuggestion(recommendation_id, s);
      // get suggestion results (ResultTable[]) and store them to get result ids
      const results: ResultTable[] = await semanticSearch(suggestion_id, s, max_num_item);
      const result_ids: number[] | null = await insertResults(results);
    }
  } catch (error) {
    console.error("Error in handleSuggestionMatching:", error);
  }
};

const makePrompt = (
  clothing_type: ClothingType,
  height: number | null,
  style_preferences: string | null,
  max_num_suggestion: number,
  label_string: string
): string => {
  /* TODO: make a good prompt based on input to generate suggestions */

  /* END TODO */
  return "";
};

const makeSuggestions = async (
  clothing_type: ClothingType,
  height: number | null,
  style_preferences: string | null,
  max_num_suggestion: number,
  label_string: string
) => {
  const model = "gpt-4o-mini";
  const prompt = makePrompt(
    clothing_type,
    height,
    style_preferences,
    max_num_suggestion,
    label_string
  );
  const suggestions = await chatCompletionTextOnly(model, prompt);
  /* TODO: some data cleansing and format checking */
  // const suggestedLabelStrings = ...
  const suggestedLabelStrings: string[] = [];
  /* END TODO */

  return suggestedLabelStrings;
};

const handleSubmission = async (
  clothing_type: ClothingType,
  image_url: ImageURL,
  height: number | null,
  style_preferences: string | null,
  user_id: number,
  max_num_suggestion: number,
  max_num_item: number
): Promise<number> => {
  try {
    // store param and upload
    const param_id: number = await insertParam(
      height,
      clothing_type,
      style_preferences
    );
    // const label_string = await extractLabelsFromImage(image_url) as string;
    const label_string: string = await extractLabelsFromImage(image_url);
    const upload_id: number = await insertUpload(image_url, label_string, user_id);
    const recommendation_id: number = await insertRecommendation(param_id, upload_id);

    // generate suggestions
    const suggested_label_strings: string[] = await makeSuggestions(
      clothing_type,
      height,
      style_preferences,
      max_num_suggestion,
      label_string
    );
    return recommendation_id;
  } catch (error) {
    console.error("Error in handleSubmission:", error);
    return -1;
  }
};
export { handleSuggestionMatching, makeSuggestions, handleSubmission };
