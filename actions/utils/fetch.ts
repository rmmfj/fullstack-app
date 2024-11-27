"use server";
import prisma from '@/prisma/db';
import {
  ItemTable,
  ParamTable,
  RecommendationTable,
  ResultTable,
  Series,
  SimplifiedItemTable,
  SuggestionTable,
  UploadTable
} from "@/type";
import { handleDatabaseError } from '../activity';

const getResults = async (suggestionId: number): Promise<ResultTable[] | null> => {
  try {
    const results = await prisma.result.findMany({
      where: { suggestion_id: suggestionId },
      select: {
        created_at: true,
        id: true,
        distance: true,
        item_id: true,
        suggestion_id: true,
      },
    });
    return results.length > 0 ? results : null;
  } catch (error) {
    return handleDatabaseError(error, 'getResults');
  }
};

// Fetches suggestions based on a recommendation ID
const getSuggestion = async (recommendationId: string): Promise<SuggestionTable[] | null> => {
  try {
    const suggestions = await prisma.suggestion.findMany({
      where: { recommendation_id: recommendationId },
    });
    return suggestions.length > 0 ? suggestions : null;
  } catch (error) {
    return handleDatabaseError(error, 'getSuggestion');
  }
};

// Fetches recommendation by ID
const getRecommendationById = async (recommendationId: string): Promise<RecommendationTable | null> => {
  try {
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
    });
    return recommendation ?? null;
  } catch (error) {
    return handleDatabaseError(error, 'getRecommendationById');
  }
};

// Fetches parameter by ID
const getParamById = async (paramId: number): Promise<ParamTable | null> => {
  try {
    const param = await prisma.param.findUnique({
      where: { id: paramId },
    });
    return param ?? null;
  } catch (error) {
    return handleDatabaseError(error, 'getParamById');
  }
};

// Fetches upload by ID
const getUploadById = async (uploadId: number): Promise<UploadTable | null> => {
  try {
    const upload = await prisma.upload.findUnique({
      where: { id: uploadId },
    });
    return upload ?? null;
  } catch (error) {
    return handleDatabaseError(error, 'getUploadById');
  }
};

// Fetches item by ID
const getItemById = async (itemId: string): Promise<ItemTable | null> => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });
    return item ?? null;
  } catch (error) {
    return handleDatabaseError(error, 'getItemById');
  }
};

// Fetches multiple items by their IDs
const getItemsByIds = async (itemIds: string[]): Promise<ItemTable[] | null> => {
  try {
    const items = await prisma.item.findMany({
      where: { id: { in: itemIds } },
    });
    return items.length > 0 ? items : null;
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
    const items = await prisma.item.findMany({
      where: { series_id: seriesId },
    });

    return items.length > 0 ? items : [];
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
  user_id: string | null
): Promise<Series[] | null> => {
  try {
    // console.time("getSeriesByIdsForSearching");

    const matViewName = gender === "neutral" ? "all_item_matview" : `${gender}_item_matview`;
    const uniqueSeriesIds = Array.from(new Set(series_ids));
    const seriesArray: Series[] = [];

    const items = await prisma.$queryRawUnsafe<SimplifiedItemTable[]>(
      `SELECT id, clothing_type, color, external_link, gender, image_url, label_string, price, provider, series_id, title
      FROM ${matViewName}
      WHERE series_id IN (${uniqueSeriesIds.map((_, index) => `$${index + 1}`).join(", ")})`,
      ...uniqueSeriesIds
    );

    for (const seriesId of uniqueSeriesIds) {
      const seriesItems = items.filter(item => item.series_id === seriesId);

      if (seriesItems.length === 0) {
        console.log(`No valid items for series ${seriesId}.`);
        continue;
      }

      const isFavorite = user_id !== null
        ? await prisma.favorite.findFirst({
            where: {
              user_id: user_id,
              series_id: seriesId,
            },
          }) !== null
        : false;

      const originalItems = seriesItems.filter(item => originalItemIds.includes(item.id));
      const otherItems = seriesItems.filter(item => !originalItemIds.includes(item.id));

      const sortedItems = [
        ...originalItems.sort((a, b) => originalItemIds.indexOf(a.id) - originalItemIds.indexOf(b.id)),
        ...otherItems
      ].map(item => ({
        ...item,
        price: item.price ? Number(item.price) : 0,
      }));

      const series: Series = {
        items: sortedItems,
        isFavorite: isFavorite,
      };
      seriesArray.push(series);
    }

    // console.timeEnd("getSeriesByIdsForSearching");
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
  user_id: string | null
): Promise<Series[]|null> => {
  try {
    // console.time("getSeriesForRecommendation");
    let clothingTypeString = clothingType === "top" ? "bottom" : "top";
    let genderString = gender === "neutral" ? "all" : gender;

    const viewName = `${genderString}_${clothingTypeString}_item_matview`;
    // console.log("viewName =", viewName);
  
    const uniqueSeriesIds = Array.from(new Set(series_ids));
    const seriesArray: Series[] = [];

    const favorites = (user_id === null ? [] : await prisma.favorite.findMany({
      where: { 
        user_id: user_id, 
        series_id: { in: uniqueSeriesIds } },
    }));

    const favoriteSeriesIds = new Set(favorites.map(fav => fav.series_id));

    for (const seriesId of uniqueSeriesIds) {
      const data: SimplifiedItemTable[] = await prisma.$queryRawUnsafe(
        `SELECT id, clothing_type, color, external_link, gender, image_url, label_string, price, provider, series_id, title
        FROM ${viewName} WHERE series_id = $1;`, seriesId
      );

      if (data.length === 0) {
        console.log(`No valid items for series ${seriesId}.`);
        continue;
      }
      // const isFavorite = await prisma.favorite.findFirst({
      //   where: {
      //     user_id: user_id,
      //     series_id: seriesId,
      //   },
      // }) !== null;
      const isFavorite = favoriteSeriesIds.has(seriesId);

      const originalItems = data.filter(item => originalItemIds.includes(item.id));
      const otherItems = data.filter(item => !originalItemIds.includes(item.id));

      const sortedItems = [
        ...originalItems.sort((a, b) => originalItemIds.indexOf(a.id) - originalItemIds.indexOf(b.id)),
        ...otherItems
      ].map(item => ({
        ...item,
        price: item.price ? Number(item.price) : 0,
      }));

      const series: Series = {
        items: sortedItems,
        isFavorite: isFavorite,
      };
      seriesArray.push(series);
    }
    
    // console.timeEnd("getSeriesForRecommendation");
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
  getSeriesById, getSeriesByIdsForSearching,
  getSeriesForRecommendation, getSeriesIdsByItemIds,
  getSuggestion,
  getUploadById
};
