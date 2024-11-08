"use server";
import prisma from '@/prisma/db';
import {
  ItemTable,
  ParamTable,
  RecommendationTable,
  ResultTable,
  SuggestionTable,
  UploadTable,
  Series,
  SimplifiedItemTable,
  SeriesWithFavorite
} from "@/type";
import { handleDatabaseError } from '../activity';

const getResults = async (suggestionId: number): Promise<ResultTable[] | null> => {
  try {
    return await prisma.result.findMany({
      where: { suggestion_id: suggestionId },
      select: {
        created_at: true,
        id: true,
        distance: true,
        item_id: true,
        suggestion_id: true,
      },
    });
  } catch (error) {
    return handleDatabaseError(error, 'getResults');
  }
};

// Fetches suggestions based on a recommendation ID
const getSuggestion = async (inputRecommendationId: number): Promise<SuggestionTable[] | null> => {
  try {
    const recommendationId = inputRecommendationId ? Number(inputRecommendationId) : null;
    return await prisma.suggestion.findMany({
      where: { recommendation_id: recommendationId },
    });
  } catch (error) {
    return handleDatabaseError(error, 'getSuggestion');
  }
};

// Fetches recommendation by ID
const getRecommendationById = async (inputRecommendationId: number): Promise<RecommendationTable | null> => {
  try {
    const recommendationId = inputRecommendationId ? Number(inputRecommendationId) : null;
    return await prisma.recommendation.findUnique({
      where: { id: recommendationId as number },
    }) as RecommendationTable | null;
  } catch (error) {
    return handleDatabaseError(error, 'getRecommendationById');
  }
};

// Fetches parameter by ID
const getParamById = async (paramId: number): Promise<ParamTable | null> => {
  try {
    return await prisma.param.findUnique({
      where: { id: paramId },
    }) as ParamTable | null;
  } catch (error) {
    return handleDatabaseError(error, 'getParamById');
  }
};

// Fetches upload by ID
const getUploadById = async (uploadId: number): Promise<UploadTable | null> => {
  try {
    return await prisma.upload.findUnique({
      where: { id: uploadId },
    }) as UploadTable | null;
  } catch (error) {
    return handleDatabaseError(error, 'getUploadById');
  }
};

// Fetches item by ID
const getItemById = async (itemId: string): Promise<ItemTable | null> => {
  try {
    return await prisma.item.findUnique({
      where: { id: itemId },
    }) as ItemTable | null;
  } catch (error) {
    return handleDatabaseError(error, 'getItemById');
  }
};

// Fetches multiple items by their IDs
const getItemsByIds = async (itemIds: string[]): Promise<ItemTable[] | null> => {
  try {
    return await prisma.item.findMany({
      where: { id: { in: itemIds } },
    }) as ItemTable[];
  } catch (error) {
    return handleDatabaseError(error, 'getItemsByIds');
  }
};

// Fetches series ID by item ID
const getSeriesIDByItemId = async (itemId: string): Promise<string | null> => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { series_id: true },
    });
    return item?.series_id ?? null;
  } catch (error) {
    return handleDatabaseError(error, 'getSeriesIDByItemId');
  }
};

// Fetches series IDs by multiple item IDs
const getSeriesIdsByItemIds = async (itemIds: string[]): Promise<string[]> => {
  const seriesIdsSet = new Set<string>();
  for (const itemId of itemIds) {
    const seriesId = await getSeriesIDByItemId(itemId);
    if (seriesId) {
      seriesIdsSet.add(seriesId);
    }
  }
  return Array.from(seriesIdsSet);
};

// Fetches items in a series by series ID
const getSeriesById = async (seriesId: string): Promise<ItemTable[] | null> => {
  try {
    return await prisma.item.findMany({
      where: { series_id: seriesId },
    }) as ItemTable[];
  } catch (error) {
    return handleDatabaseError(error, 'getSeriesById');
  }
};

// Fetches item IDs in a series by series ID
const getItemsIDBySeriesId = async (seriesId: string): Promise<string[] | null> => {
  try {
    const items = await prisma.item.findMany({
      where: { series_id: seriesId },
      select: { id: true },
    });
    return items.map(item => item.id);
  } catch (error) {
    return handleDatabaseError(error, 'getItemsIDBySeriesId');
  }
};

const getSeriesByIdsForSearching = async (
  series_ids: string[],
  originalItemIds: string[],
  gender: string,
): Promise<Series[]|SeriesWithFavorite[] | null> => {
  try {
    console.time("getSeriesByIdsForSearching");
    const matViewName = gender === "neutral" ? "all_item_matview" : `${gender}_item_matview`;

    const uniqueSeriesIds = Array.from(new Set(series_ids));
    const seriesArray: Series[] = [];

    for (const seriesId of uniqueSeriesIds) {
      const items = await prisma.$queryRawUnsafe<SimplifiedItemTable[]>(
        `SELECT id, clothing_type, color, external_link, gender, image_url, label_string, price, provider, series_id, title
        FROM ${matViewName} WHERE series_id = $1`,
        seriesId
      );
      if (!items || items.length === 0) {
        console.log(`No valid items for series ${seriesId}.`);
        continue;
      }

      const originalItems = items.filter(item => originalItemIds.includes(item.id));
      const otherItems = items.filter(item => !originalItemIds.includes(item.id));

      const sortedItems = [
        ...originalItems.sort((a, b) => originalItemIds.indexOf(a.id) - originalItemIds.indexOf(b.id)),
        ...otherItems
      ].map(item => ({
        ...item,
        price: item.price ? Number(item.price) : 0,
      }));

      const series: Series = {
        items: sortedItems,
      };
      seriesArray.push(series);
    }
    console.timeEnd("getSeriesByIdsForSearching");
    return seriesArray.length > 0 ? seriesArray : null;
  } catch (error) {
    handleDatabaseError(error, "getSeriesByIdsForSearching");
    return null;
  }
};

const getSeriesForRecommendation = async (
  series_ids: string[],
  originalItemIds: string[],
  gender: string,
  clothingType: string,
  user_id: string,
): Promise<Series[] | null> => {
  try {
    console.time("getSeriesForRecommendation");
    let clothingTypeString = clothingType === "top" ? "bottom" : "top";
    let genderString = gender === "neutral" ? "all" : gender;

    const viewName = `${genderString}_${clothingTypeString}_item_matview`;
  
    const uniqueSeriesIds = Array.from(new Set(series_ids));
    const seriesArray: Series[] = [];

    for (const seriesId of uniqueSeriesIds) {
      const data: SimplifiedItemTable[] = await prisma.$queryRawUnsafe(
        `SELECT id, clothing_type, color, external_link, gender, image_url, label_string, price, provider, series_id, title
        FROM ${viewName} WHERE series_id = $1;`, seriesId
      );

      if (data.length === 0) {
        console.log(`No valid items for series ${seriesId}.`);
        continue;
      }

      const isFavorite = await prisma.favorite.findFirst({
        where: {
          user_id: user_id,
          series_id: seriesId,
        },
      }) !== null;

      const originalItems = data.filter(item => originalItemIds.includes(item.id));
      const otherItems = data.filter(item => !originalItemIds.includes(item.id));

      const sortedItems = [
        ...originalItems.sort((a, b) => originalItemIds.indexOf(a.id) - originalItemIds.indexOf(b.id)),
        ...otherItems
      ].map(item => ({
        ...item,
        price: item.price ? Number(item.price) : 0,
      }));

      const series: SeriesWithFavorite = {
        items: sortedItems,
        isFavorite
      };
      seriesArray.push(series);
    }
    
    console.timeEnd("getSeriesForRecommendation");
    return seriesArray.length > 0 ? seriesArray : null;
  } catch (error) {
    handleDatabaseError(error, "getSeriesForRecommendation");
    return null;
  }
};

export {
  getItemById,
  getItemsByIds,
  getItemsIDBySeriesId,
  getParamById,
  getRecommendationById,
  getResults,
  getSeriesById,
  getSeriesIdsByItemIds,
  getSuggestion,
  getUploadById,
  getSeriesByIdsForSearching,
  getSeriesForRecommendation
};