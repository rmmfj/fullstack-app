"use server";
import { SearchResult, Series, SimplifiedItemTable, UnstoredResult, ClothingType, Gender, ItemTable, SeriesWithFavorite } from "@/type";
import { getSeriesByIdsForSearching } from "./fetch";
import { generateEmbedding } from "./embedding";
import prisma from "@/prisma/db";
import { handleDatabaseError } from "../activity";
import { isFavorite } from "../favorite";

//recommendation
const vectorSearchForRecommendation = async (
  suggestedLabelString: string,
  numMaxItem: number,
  gender: Gender,
  clothing_type: ClothingType,
): Promise<Series[] | null> => {
  try {
    let clothingTypeString = clothing_type === "top" ? "bottom" : "top";
    let genderString = gender === "neutral" ? "all" : gender;
    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);
    const matchThreshold = 0.2;

    const viewName = `${genderString}_${clothingTypeString}_item_matview`;

    const items: SimplifiedItemTable[] = await prisma.$queryRawUnsafe(`
      SELECT id, clothing_type, color, external_link, gender, image_url, label_string, price, provider, series_id, title
      FROM ${viewName}
      WHERE ${viewName}.embedding <#> $1::vector < $2
      ORDER BY ${viewName}.embedding <#> $1::vector
      LIMIT $3;
    `, suggestedEmbedding, matchThreshold, numMaxItem);

    const series: Series[] = items.map(simplifiedItem => ({
      items: [{
        ...simplifiedItem,
        price: simplifiedItem.price ? Number(simplifiedItem.price) : 0,
      }],
    }));

    return series;
  } catch (error) {
    handleDatabaseError(error, "vectorSearchForRecommendation");
    return null;
  }
};

const semanticSearchForRecommendation = async ({
  suggestionId,
  suggestedLabelString,
  numMaxItem,
  gender,
  clothing_type,
}: {
  suggestionId: number;
  suggestedLabelString: string;
  numMaxItem: number;
  gender: Gender;
  clothing_type: ClothingType;
}): Promise<UnstoredResult[] | null> => {
  try {
    const similarItems = await vectorSearchForRecommendation(
      suggestedLabelString,
      numMaxItem,
      gender,
      clothing_type,
    );

    if (!similarItems) {
      return null;
    }

    const results: UnstoredResult[] = similarItems.map(
      (series: Series, index: number) => ({
        distance: index,
        item_id: series.items[0].id,
        suggestion_id: suggestionId,
      })
    );

    return results;
  } catch (error) {
    handleDatabaseError(error, "semanticSearchForRecommendation");
    return null;
  }
};

const semanticSearchWithoutLogin = async ({
  suggestedLabelString,
  numMaxItem,
  gender,
  clothing_type,
}: {
  suggestedLabelString: string;
  numMaxItem: number;
  gender: Gender;
  clothing_type: ClothingType;
}): Promise<Series[] | null> => {
  try {
    const similarItems = await vectorSearchForRecommendation(
      suggestedLabelString,
      numMaxItem,
      gender,
      clothing_type,
    );

    if (!similarItems) {
      return null;
    }

    const itemIds = similarItems.flatMap(series => series.items.map(item => item.id));

    const items: ItemTable[] = await prisma.item.findMany({
      where: {
        id: {
          in: itemIds,
        },
      },
    });

    const simplifiedItems: SimplifiedItemTable[] = items.map(item => ({
      clothing_type: item.clothing_type,
      gender: item.gender,
      id: item.id,
      color: item.color,
      external_link: item.external_link,
      image_url: item.image_url,
      label_string: item.label_string,
      price: item.price,
      provider: item.provider,
      series_id: item.series_id,
      title: item.title,
    }));

    const seriesArray: Series[] = [{
      items: simplifiedItems,
    }];

    return seriesArray;
  } catch (error) {
    handleDatabaseError(error, "semanticSearchWithoutLogin");
    return null;
  }
};

//searching
const vectorSearchForSearching = async (
  suggestedLabelString: string,
  page: number,
  pageSize: number,
  gender: Gender,
  priceLowerBound?: number,
  priceUpperBound?: number,
  providers?: string[],
  clothingType?: ClothingType,
): Promise<{ series: Series[]; totalItems: number } | null> => {
  try {
    //setting the mat view
    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);
    const matchThreshold = -0.9;
    let genderString = gender === "neutral" ? "all" : gender;
    const viewName = `${genderString}_item_matview`;
    const offset = (page - 1) * pageSize;

    //setting the filters
    let filterConditions = `${viewName}.embedding <#> $1::vector > $2`;
    const queryParams: any[] = [suggestedEmbedding, matchThreshold];
    let paramIndex = 3;

    if (priceLowerBound !== undefined) {
      filterConditions += ` AND price >= $${paramIndex++}`;
      queryParams.push(priceLowerBound);
    }
    if (priceUpperBound !== undefined) {
      filterConditions += ` AND price <= $${paramIndex++}`;
      queryParams.push(priceUpperBound);
    }
    if (providers && providers.length > 0) {
      const providerPlaceholders = providers.map((_, index) => `$${paramIndex + index}`).join(", ");
      filterConditions += ` AND provider IN (${providerPlaceholders})`;
      queryParams.push(...providers);
      paramIndex += providers.length;
    }
    if (clothingType) {
      filterConditions += ` AND clothing_type = $${paramIndex++}`;
      queryParams.push(clothingType);
    }

    const countQuery = `
      SELECT COUNT(*) AS total_count
      FROM ${viewName}
      WHERE ${filterConditions}
      GROUP BY embedding
      ORDER BY ${viewName}.embedding <#> $1::vector ASC
    `;

    const totalItemsResult = await prisma.$queryRawUnsafe<{ total_count: bigint }[]>(countQuery, ...queryParams);
    // console.log("Similarity results: ", totalItemsResult);

    const totalItems = totalItemsResult.reduce((sum, item) => sum + Number(item.total_count), 0);
    // console.log("query total count: ", totalItems);

    const mainQuery = `
      SELECT id, clothing_type, color, external_link, gender, image_url, label_string, price, provider, series_id, title
      FROM ${viewName}
      WHERE ${filterConditions}
      ORDER BY ${viewName}.embedding <#> $1::vector ASC
      LIMIT $${paramIndex++} OFFSET $${paramIndex};
    `;
    const mainQueryParams = [...queryParams, pageSize, offset];

    const items: SimplifiedItemTable[] = await prisma.$queryRawUnsafe(mainQuery, ...mainQueryParams);

    const series: Series[] = items.map(simplifiedItem => ({
      items: [{
        ...simplifiedItem,
        price: simplifiedItem.price ? Number(simplifiedItem.price) : 0,
      }],
    }));

    return { series, totalItems };
  } catch (error) {
    handleDatabaseError(error, "vectorSearchForSearching");
    return null;
  }
};


const semanticSearchForSearching = async ({
  suggestedLabelString,
  gender,
  priceLowerBound,
  priceUpperBound,
  providers,
  clothingType,
  page,
  user_id
}: {
  suggestedLabelString: string;
  gender: Gender;
  priceLowerBound?: number;
  priceUpperBound?: number;
  providers?: string[];
  clothingType?: ClothingType;
  page: number;
  user_id?: string
}): Promise<SearchResult | null> => {
  try {
    const searchResultData = await vectorSearchForSearching(
      suggestedLabelString,
      page,
      20,
      gender,
      priceLowerBound,
      priceUpperBound,
      providers,
      clothingType,
    );

    if (!searchResultData || searchResultData.series.length === 0) {
      return null;
    }

    const { series, totalItems } = searchResultData;
    const totalPage = Math.ceil(totalItems / 20);

    const uniqueSeriesIds: string[] = [];
    const seenSeriesIds = new Set<string>();

    for (const seriesItem of series) {
      for (const item of seriesItem.items) {
        const seriesId = item.series_id;
        if (seriesId && !seenSeriesIds.has(seriesId)) {
          uniqueSeriesIds.push(seriesId);
          seenSeriesIds.add(seriesId);
        }
      }
    }
    const similarItemIds = series.flatMap(seriesItem => seriesItem.items.map(item => item.id));
    
    let seriesArray: Series[] | SeriesWithFavorite[] = await getSeriesByIdsForSearching(uniqueSeriesIds, similarItemIds, gender) || [];

    if (user_id !== undefined) {
      seriesArray = await Promise.all(
        seriesArray.map(async (s) => ({
          ...s,
          isFavorite: await isFavorite(user_id, s.items[0].series_id)
      }))
    );
    return {
      series: seriesArray as SeriesWithFavorite[],
      totalPage
      } as SearchResult;
    }
    return {
    series: seriesArray as Series[],
    totalPage
    } as SearchResult;

  } catch (error) {
    handleDatabaseError(error, "semanticSearchForSearching");
    return null;
  }
};

export { semanticSearchForRecommendation, semanticSearchForSearching, semanticSearchWithoutLogin };