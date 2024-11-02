"use server";
import supabase from "@/lib/supabaseClient";
import { UnstoredResult, ClothingType, Gender } from "@/type";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/prisma/db";


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

// const storeImageToStorage = async (base64: string) => {
//   console.time("storeImageToStorage");
//   const blob: Blob = base64ToBlob(base64);
//   const filename = `image-${uuidv4()}`;
//   await supabase.storage.from("image").upload(filename, blob, {
//     cacheControl: "3600",
//     upsert: false,
//   });
//   const {
//     data: { publicUrl },
//   } = supabase.storage.from("image").getPublicUrl(filename);
//   console.timeEnd("storeImageToStorage");
//   return publicUrl;
// };

const storeImageToStorage = async (base64: string, filename: string) => {
  console.time("storeImageToStorage");

  const blob = base64ToBlob(base64); // Convert base64 to Blob
  const formData = new FormData();
  formData.append("file", blob, filename); // Use the original filename

  const imageSourceUrl = process.env.IMAGE_SOURCE_URL;
  console.log(imageSourceUrl);
  try {
    // Replace Supabase call with a POST request to your Flask API on port 8086
    const response = await fetch(`${imageSourceUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }
    const result = await response.json();
    console.log("testing response", response);
    console.timeEnd("storeImageToStorage");
    console.log(`Image uploaded successfully with ID: ${result.id}`)
    // Return the image URL from the server response
    return result.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    console.timeEnd("storeImageToStorage");
    return null;
  }
};


// Inserts results into the database
const insertResults = async (
  results: UnstoredResult[]
): Promise<number[] | null> => {
  try {
    const formattedResults = results.map(result => ({
      ...result,
      item_id: result.item_id.toString(),
    }));

    const insertedResults = await prisma.result.createMany({
      data: formattedResults,
    });

    return insertedResults.count > 0
      ? results.map((_, index) => index)
      : [];
  } catch (error) {
    console.error("Unexpected error in insertResults:", error);
    return null;
  }
};

// Inserts a suggestion into the database
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
    console.error("Unexpected error in insertSuggestion:", error);
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
    console.error("Unexpected error in insertRecommendation:", error);
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
    console.error("Unexpected error in insertParam:", error);
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
    console.error("Unexpected error in insertUpload:", error);
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
