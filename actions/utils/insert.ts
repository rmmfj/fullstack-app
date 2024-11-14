"use server";
import supabase from "@/lib/supabaseClient";
import { UnstoredResult, ClothingType, Gender } from "@/type";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/prisma/db";
import { handleDatabaseError } from "../activity";

const base64ToBlob = (base64: string): Blob => {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const storeImageToStorage = async (base64: string, filename: string) => {
  console.time("storeImageToStorage");

  // Convert base64 to Blob
  const blob: Blob = base64ToBlob(base64);

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("file", blob, filename);

  try {
    // Send the image to the image server
    const response = await fetch("https://clothing.rfjmm.com/image/upload", {
      method: "POST",
      body: formData, // need to specify how to parse form data in image server code
      headers: {
        Origin: "https://clothing.rfjmm.com",
        // "Content-Type": "multipart/form-data",
      },
      // headers: {
      //   Authorization: `Bearer ${process.env.IMAGE_SERVER_ACCESS_SECRET}`, // Replace with your shared secret
      // },
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    // Parse the JSON response
    const result = await response.json();

    console.timeEnd("storeImageToStorage");
    return result.url; // Return the URL to access the image
  } catch (error) {
    console.error("Error uploading image:", error);
    console.timeEnd("storeImageToStorage");
    throw error;
  }
};

// Inserts results into the database
const insertResults = async (
  results: UnstoredResult[]
): Promise<number[] | null> => {
  try {
    const formattedResults = results.map((result) => ({
      ...result,
      item_id: result.item_id.toString(),
    }));

    const insertedResults = await prisma.result.createMany({
      data: formattedResults,
    });

    return insertedResults.count > 0 ? results.map((_, index) => index) : [];
  } catch (error) {
    handleDatabaseError(error, "insertResults");
    return null;
  }
};

const insertSuggestion = async ({
  recommendationId,
  labelString,
  styleName,
  description,
}: {
  recommendationId: number;
  labelString: string;
  styleName: string;
  description: string;
}): Promise<number> => {
  try {
    const suggestion = await prisma.suggestion.create({
      data: {
        recommendation_id: recommendationId,
        label_string: labelString,
        style_name: styleName,
        description,
      },
    });
    return suggestion.id;
  } catch (error) {
    handleDatabaseError(error, "insertSuggestion");
    return -1;
  }
};

// Inserts a new recommendation into the database
const insertRecommendation = async ({
  paramId,
  uploadId,
  userId,
}: {
  paramId: number;
  uploadId: number;
  userId: string;
}): Promise<number> => {
  try {
    const recommendation = await prisma.recommendation.create({
      data: {
        param_id: paramId,
        upload_id: uploadId,
        user_id: userId,
      },
    });
    return recommendation.id;
  } catch (error) {
    handleDatabaseError(error, "insertRecommendation");
    return -1;
  }
};

const insertParam = async (
  gender: Gender,
  clothingType: ClothingType,
  model: string
): Promise<number> => {
  try {
    const param = await prisma.param.create({
      data: {
        gender,
        clothing_type: clothingType,
        model,
      },
    });
    return param.id;
  } catch (error) {
    handleDatabaseError(error, "insertParam");
    return -1;
  }
};

const insertUpload = async (imageUrl: string, userId: string) => {
  try {
    const upload = await prisma.upload.create({
      data: {
        image_url: imageUrl,
        user_id: userId,
      },
    });
    revalidatePath("/upload");
    return upload.id;
  } catch (error) {
    handleDatabaseError(error, "insertUpload");
    return -1;
  }
};

export {
  insertParam,
  insertRecommendation,
  insertResults,
  insertSuggestion,
  insertUpload,
  storeImageToStorage,
};
