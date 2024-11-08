"use server";
import { handleDatabaseError } from "./activity";
import prisma from "@/prisma/db";

//insert and delete using the same function
const handleFavorite = async (
  user_id: string,
  series_id: string,
): Promise<number> => {
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
      return 0;
    } else {
      await prisma.favorite.create({
        data: {
          user_id,
          series_id,
        },
      });
      return 1;
    }
  } catch (error) {
    handleDatabaseError(error, "toggleFavorite");
    return -1;
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
    // console.log("favorite: ", favorite);

    return favorite !== null;
  } catch (error) {
    handleDatabaseError(error, "isFavorite");
    return false;
  }
};



export { handleFavorite, isFavorite };
