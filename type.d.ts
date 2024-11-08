import { Item, Param, Profile, Recommendation, Result, Suggestion, Upload } from "@prisma/client";


export type ItemTable = Item;
export type ParamTable = Param;
export type RecommendationTable = Recommendation;
export type SuggestionTable = Suggestion;
export type UploadTable = Upload;
export type ResultTable = Result;
export type ProfileTable = Profile;
export type FavoriteTable = Favorite;

export type SimplifiedItemTable = Omit<Item, 'embedding'>;
export type Series = { items: SimplifiedItemTable[] };

export type SeriesWithFavorite = { items: SimplifiedItemTable[], isFavorite: boolean };

export interface Recommendation {
  param: ParamTable;
  upload: UploadTable;
  styles: {
    [styleName: string]: { series: SeriesWithFavorite[], description: string };
  };
}

export interface RecommendationWithoutLogin {
  clothing_type: String;
  gender: String;
  model: String;
  image_url: String;
  styles: {
    [styleName: string]: { series: Series[], description: string };
  };
}

// export interface SearchResult {
//   series: SeriesWithFavorite[];
//   totalPage: number;
// }

type SearchResultWithFavorite = {
  series: SeriesWithFavorite[];
  totalPage: number;
};

type SearchResultWithoutFavorite = {
  series: Series[];
  totalPage: number;
};

type SearchResult = user_id extends string ? SearchResultWithFavorite : SearchResultWithoutFavorite;

export type RecommendationPreview = Recommendation & {
  upload: UploadTable;
};

export interface UnstoredResult {
  distance: number;
  item_id: string;
  suggestion_id: number;
}

export type ClothingType = Enums<"clothing_type">;
export type BodyType = Enums<"body_type">;
export type Gender = Enums<"gender">;