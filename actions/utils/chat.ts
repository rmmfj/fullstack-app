"use server";
import openai from "@/utils/openai";
import { ImageURL } from "openai/resources/beta/threads/messages";

const sendImgURLAndPromptToGPT = async ({
  model,
  prompt,
  imageUrl,
}: {
  model: string;
  prompt: string;
  imageUrl: string;
}): Promise<string | null> => {
  try {
    const isImageAvailable = await checkImageAvailability(imageUrl);
    if (!isImageAvailable) {
      console.log("Image not available.");
      return null;
    }

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: imageUrl } as ImageURL }] },
      ],
    });
    return completion.choices[0].message.content;
  } catch (e) {
    console.error("Error during API request:", e);
    return null;
  }
};

const sendPromptToGPT = async ({
  model,
  prompt,
}: {
  model: string;
  prompt: string;
}): Promise<string | null> => {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    });
    return completion.choices[0].message.content;
  } catch (e) {
    console.error("Error during API request:", e);
    return null;
  }
};


const checkImageAvailability = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    console.log(response);
    return response.ok;
  } catch (e) {
    console.error(`Error checking image availability for ${imageUrl}:`, e);
    return false;
  }
};

export { sendImgURLAndPromptToGPT, checkImageAvailability, sendPromptToGPT };
