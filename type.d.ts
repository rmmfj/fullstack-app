import { Item, Param, Profile, Recommendation, Result, Suggestion, Upload, Favorite } from "@prisma/client";

export type ItemTable = Item;
export type ParamTable = Param;
export type RecommendationTable = Recommendation;
export type SuggestionTable = Suggestion;
export type UploadTable = Upload;
export type ResultTable = Result;
export type ProfileTable = Profile;
export type FavoriteTable = Favorite;

export type SimplifiedItemTable = Omit<Item, 'embedding'>;
export type Series = { items: SimplifiedItemTable[], isFavorite: boolean };

export interface Recommendation {
  clothingType: ClothingType;
  gender: Gender;
  model: string;
  imageUrl: string;
  styles: {
    [styleName: string]: { series: Series[], description: string };
  };
}
export interface SearchResult {
  series: Series[];
  totalPages: number;
}

export type RecommendationPreview = Recommendation & {
  upload: UploadTable;
};

type ValidatedRecommendation = {
  styleName: string;
  description: string;
  labelString: string;
};
export interface UnstoredResult {
  distance: number;
  item_id: string;
  suggestion_id: number;
}

export type ClothingType = Enums<"clothing_type">;
export type BodyType = Enums<"body_type">;
export type Gender = Enums<"gender">;