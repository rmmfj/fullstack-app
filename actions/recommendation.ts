// recommendation.ts
"use server";
import {
  ItemTable,
  ParamTable,
  Recommendation,
  RecommendationTable,
  ResultTable,
  SuggestionTable,
  UploadTable,
} from "@/type";
import { createClient } from "@/utils/supabase/server";
import { getParamById, getUploadById } from "./user-input";
import { getItemsByIds } from "./item";

const getResults = async (
  suggestion_id: number
): Promise<ResultTable[] | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("result")
      .select("*")
      .eq("id", suggestion_id)
      .single();
    if (error) {
      console.error("Error fetching item:", error);
      return null;
    }
    return data as ResultTable[];
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

const insertResults = async (results: ResultTable[]): Promise<number[] | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("result")
    .insert(results)
    .select("id");
  if (error) {
    console.log(error);
  }
  if (data && data.length > 0) {
    const result_ids = data.map(o => o.id);
    return result_ids as number[];
  } else {
    return null;
  }
};

// const deleteResults = async (suggestion_id: string) => {
//   const supabase = createClient();
//   const { error } = await supabase
//     .from("result")
//     .delete()
//     .eq("suggestion_id", suggestion_id);
//   if (error) {
//     console.log(error);
//   }

//   return;
// };

const getSuggestion = async (
  recommendation_id: number
): Promise<SuggestionTable[] | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("suggestion")
      .select("*")
      .eq("recommendation_id", recommendation_id);
    if (error) {
      console.error("Error fetching item:", error);
      return null;
    }
    return data as SuggestionTable[];
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

const insertSuggestion = async (
  recommendation_id: number,
  label_string: string
): Promise<number> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("suggestion")
    .insert({ recommendation_id, label_string })
    .select("id");
  if (error) {
    console.log(error);
  }
  if (data && data.length > 0) {
    const suggestion_id = data[0].id;
    return suggestion_id as number;
  } else {
    return -1;
  }
};

// const deleteSuggestion = async (recommendation_id: string) => {
//   const supabase = createClient();
//   const { error } = await supabase
//     .from("suggestion")
//     .delete()
//     .eq("recommendation_id", recommendation_id);
//   if (error) {
//     console.log(error);
//   }
//   return;
// };

const getRecommendationById = async (
  recommendation_id: number
): Promise<Recommendation | null> => {
  const supabase = createClient();
  const { data: recommendation, error: recommedation_error } = await supabase
    .from("recommendation")
    .select("*")
    .eq("id", recommendation_id)
    .returns<RecommendationTable[]>();
  if (recommedation_error) {
    console.error("Error fetching item:", recommedation_error);
    return null;
  }

  let recommendation_record: any = {};

  const param_id = recommendation[0].param_id as number;
  const upload_id = recommendation[0].upload_id as number;
  const param = (await getParamById(param_id)) as ParamTable;
  const upload = (await getUploadById(upload_id)) as UploadTable;
  recommendation_record.param = param;
  recommendation_record.upload = upload;

  const suggestions = (await getSuggestion(
    recommendation_id
  )) as SuggestionTable[];
  for (const s of suggestions) {
    const label_string = s.label_string as string;
    const results = (await getResults(s.id)) as ResultTable[];
    const item_ids = results.map((r) => r.item_id) as number[];
    const items = (await getItemsByIds(item_ids)) as ItemTable[];
    // create a map to map item_id to distance
    const itemIdToDistanceMapper: { [key: number]: ResultTable } =
      results.reduce((acc, item) => {
        acc[item.item_id as number] = item;
        return acc;
      }, {} as { [key: number]: ResultTable });
    // sort by distance
    items.sort(
      (a, b) =>
        (itemIdToDistanceMapper[a.id].distance as number) -
        (itemIdToDistanceMapper[b.id].distance as number)
    );
    recommendation_record.items[label_string] = items;
  }
  return recommendation_record as Recommendation;
};

const insertRecommendation = async (param_id: number, upload_id: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recommendation")
    .insert([{ param_id, upload_id }])
    .select("id");
  if (error) {
    console.log(error);
  }
  if (data && data.length > 0) {
    const recommendation_id = data[0].id;
    return recommendation_id as number;
  } else {
    return -1;
  }
};

export {
  getRecommendationById,
  insertRecommendation,
  insertSuggestion,
  insertResults,
};
