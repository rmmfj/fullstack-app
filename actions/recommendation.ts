"use server";
import {
  ParamTable,
  Recommendation,
  RecommendationTable,
  ResultTable,
  Series,
  SeriesWithFavorite,
  SuggestionTable,
  UploadTable,
} from "@/type";
import {
  getParamById,
  getRecommendationById,
  getResults,
  getSeriesIdsByItemIds,
  getSuggestion,
  getUploadById,
  getSeriesForRecommendation
} from "./utils/fetch";
import { handleDatabaseError } from "./activity";

const getRecommendationRecordById = async (
  recommendation_id: number,
  user_id: string,
): Promise<Recommendation | null> => {
  try {
    const recommendation = await getRecommendationById(recommendation_id) as RecommendationTable;
    if (!recommendation || recommendation.user_id !== user_id) return null;

    const param = await getParamById(recommendation.param_id as number) as ParamTable;
    if (!param) throw new Error("Parameter not found for given param_id");

    const upload = await getUploadById(recommendation.upload_id as number) as UploadTable;
    if (!upload) throw new Error("Upload not found for given upload_id");

    const recommendation_record: Partial<Recommendation> = {
      param: param,
      upload: upload,
      styles: {},
    };

    const suggestions = (await getSuggestion(
      recommendation_id
    )) as SuggestionTable[];
    for (const s of suggestions) {
      const styleName = s.style_name as string;
      const description = s.description as string;
      const results = (await getResults(s.id)) as ResultTable[];
      if (!results.length) throw new Error("No results found");

      const item_ids = results.map((r) => r.item_id) as string[];

      const series_ids = (await getSeriesIdsByItemIds(item_ids)) as string[];
      if (!series_ids.length) throw new Error("No series IDs found");

      const gender = recommendation_record.param?.gender ?? "neutral";
      const clothingType = recommendation_record.param?.clothing_type ?? "top";
      const series = (await getSeriesForRecommendation(series_ids, item_ids, gender, clothingType, user_id)) as SeriesWithFavorite[];
      if (!series) throw new Error("No series found");

      recommendation_record.styles![styleName] = {
        series,
        description
      };
    }

    return recommendation_record as Recommendation;
  } catch (error) {
    handleDatabaseError(error, "getRecommendationRecordById");
    return null;
  }
};

export { getRecommendationRecordById };
