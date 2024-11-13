"use server";
import prisma from "@/prisma/db";

const insertActivityRecommendation = async (
  user_id: string,
  recommendation_id: number,
  activity_type: string
): Promise<number> => {
  try {
    const activity = await prisma.userActivityRecommendation.create({
      data: {
        user_id,
        recommendation_id,
        activity_type,
      },
    });
    return activity.id;
  } catch (error) {
    console.error("Unexpected error in insertActivityRecommendation:", error);
    return -1;
  }
};

const insertActivitySuggestion = async (
  user_id: string,
  suggestion_id: number,
  activity_type: string
): Promise<number> => {
  try {
    const activity = await prisma.userActivitySuggestion.create({
      data: {
        user_id,
        suggestion_id,
        activity_type,
      },
    });
    return activity.id;
  } catch (error) {
    console.error("Unexpected error in insertActivitySuggestion:", error);
    return -1;
  }
};

const insertActivityItem = async (
  user_id: string,
  item_id: string,
  activity_type: string
): Promise<number> => {
  try {
    const activity = await prisma.userActivityItem.create({
      data: {
        user_id,
        item_id,
        activity_type,
      },
    });
    return activity.id;
  } catch (error) {
    console.error("Unexpected error in insertActivityItem:", error);
    return -1;
  }
};

const handleDatabaseError = (error: unknown, functionName: string) => {
  console.error(`Unexpected error in ${functionName}:`, error);
  return null;
};

export { handleDatabaseError, insertActivityItem, insertActivityRecommendation, insertActivitySuggestion };
