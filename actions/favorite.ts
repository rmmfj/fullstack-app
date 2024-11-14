"use server";
import prisma from "@/prisma/db";
import { Series } from "@/type";
import { revalidatePath } from "next/cache";
import { handleDatabaseError } from "./activity";
import { getSeriesById } from "./utils/fetch";

// Insert and delete using the same function
const handleFavorite = async (
  user_id: string,
  series_id: string,
): Promise<number | null> => {
  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        user_id_series_id: {
          user_id,
          series_id,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          user_id_series_id: {
            user_id,
            series_id,
          },
        },
      });
      revalidatePath('/closet');
      revalidatePath('/recommendation');
      return 0;
    } else {
      await prisma.favorite.create({
        data: {
          user_id,
          series_id,
        },
      });
      revalidatePath('/recommendation');
      return 1;
    }
  } catch (error) {
    return handleDatabaseError(error, "handleFavorite");
  }
};

const isFavorite = async (
  user_id: string,
  series_id: string,
): Promise<boolean> => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        user_id_series_id: {
          user_id: user_id,
          series_id: series_id
        }
      }
    });

    return favorite !== null;
  } catch (error) {
    handleDatabaseError(error, "isFavorite");
    return false;
  }
};

const getFavoriteByUserId = async (
  user_id: string,
): Promise<Series[]> => {
  try {
    const favoriteSeries = await prisma.favorite.findMany({
      where: {
        user_id: user_id,
      },
      select: {
        series_id: true,
      },
    });

    if (favoriteSeries.length === 0) {
      return [];
    }

    const seriesIds = favoriteSeries.map(fav => fav.series_id);

    const favoriteItems = await Promise.all(
      seriesIds.map(seriesId => getSeriesById(seriesId))
    );

    const series: Series[] = favoriteItems
      .filter((items): items is NonNullable<typeof items> => items !== null)
      .map((items) => ({
        items: items.map((item) => ({
          ...item,
          price: item.price ? Number(item.price) : 0,
        })),
        isFavorite: true,
      }));

    return series;
  } catch (error) {
    handleDatabaseError(error, "getFavoriteByUserId");
    return [];
  }
};

export { getFavoriteByUserId, handleFavorite, isFavorite };