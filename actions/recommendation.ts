"use server";
import {
  ParamTable,
  Recommendation,
  RecommendationTable,
  ResultTable,
  Series,
  SuggestionTable,
  UploadTable,
} from "@/type";
import { handleDatabaseError } from "./activity";
import {
  getParamById,
  getRecommendationById,
  getResults,
  getSeriesForRecommendation,
  getSeriesIdsByItemIds,
  getSuggestion,
  getUploadById
} from "./utils/fetch";

const getRecommendationRecordById = async (
  recommendation_id: number,
  user_id: string,
): Promise<Recommendation | null> => {
  try {
    console.time("getRecommendationRecordById");
    console.time("checkpoint 5");
    const recommendation = await getRecommendationById(recommendation_id) as RecommendationTable;
    if (!recommendation || recommendation.user_id !== user_id) {
      return null;
    }
    const param = await getParamById(recommendation.param_id as number) as ParamTable;
    if (!param){
      handleDatabaseError("Parameter not found for given param_id", "getRecommendationRecordById");
      return null;
    }

    const upload = await getUploadById(recommendation.upload_id as number) as UploadTable;
    if (!upload) {
      handleDatabaseError("Upload not found for given upload_id", "getRecommendationRecordById");
      return null;
    }

    console.timeEnd("checkpoint 5");

    console.time("checkpoint 6");
    const recommendation_record: Partial<Recommendation> = {
      clothingType: param.clothing_type,
      gender: param.gender,
      model: param.model ?? undefined,
      imageUrl: upload.image_url ?? undefined,
      styles: {}
    };

    const suggestions = (await getSuggestion(
      recommendation_id
    )) as SuggestionTable[];
    if (!suggestions.length) {
      handleDatabaseError("No suggestions found for given recommendation_id", "getRecommendationRecordById");
      return null;
    }
    console.timeEnd("checkpoint 6");
    
    console.time("checkpoint suggestions");
    for (const s of suggestions) {
      const styleName = s.style_name as string;
      const description = s.description as string;
      const results = (await getResults(s.id)) as ResultTable[];
      if (!results.length) {
        handleDatabaseError("No results found for style: ${styleName}", "getRecommendationRecordById");
        return null;
      }

      
      const item_ids = results.map((r) => r.item_id) as string[];

      const series_ids = (await getSeriesIdsByItemIds(item_ids)) as string[];
      if (!series_ids.length) {
        handleDatabaseError("No series IDs found for the given items", "getRecommendationRecordById");
        return null;
      }

      const gender = recommendation_record.gender ?? "neutral";
      const clothingType = recommendation_record.clothingType ?? "top";
      const series = (await getSeriesForRecommendation(series_ids, item_ids, gender, clothingType, user_id)) as Series[];
      if (!series || series.length === 0) {
        handleDatabaseError("No series found for the given series IDs", "getRecommendationRecordById");
        return null;
      }

      recommendation_record.styles![styleName] = {
        suggestion_id: s.id,
        series,
        description
      };
    }
    console.timeEnd("checkpoint suggestions");
    console.timeEnd("getRecommendationRecordById");
    return recommendation_record as Recommendation;
  } catch (error) {
    handleDatabaseError(error, "getRecommendationRecordById");
    return null;
  }
};

export { getRecommendationRecordById };

