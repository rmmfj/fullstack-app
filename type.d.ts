import { Enums, Tables } from "@/types/supabase";

export type ItemTable = Tables<"item">;
export type ParamTable = Tables<"param">;
export type RecommendationTable = Tables<"recommendation">;
export type SuggestionTable = Tables<"suggestion">;
export type UploadTable = Tables<"upload">;
export type ResultTable = Tables<"result">;
export type SeriesTable = Tables<"series">;

export type ClothingType = Enums<"clothing_type">;

export type Series = SeriesTable & { items: ItemTable[] };

export interface Recommendation {
  param: ParamTable;
  upload: UploadTable;
  items: {
    [style: string]: Series[];
  };
}
