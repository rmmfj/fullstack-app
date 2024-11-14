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
  const NUM_MAX_RETRIES = 5;
  const RETRY_BASE_WAIT_TIME = 600;

  for (let numRetries = 0; numRetries < NUM_MAX_RETRIES; ++numRetries) {
    try {
      const isImageAvailable = await checkImageAvailability(imageUrl);
      if (!isImageAvailable) {
        console.log(`Image not available. Retrying in ${Math.pow(2, numRetries) * RETRY_BASE_WAIT_TIME} ms...`);
        const waitTime = Math.pow(2, numRetries) * RETRY_BASE_WAIT_TIME;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: imageUrl } as ImageURL }] },
        ],
      });
      const response = completion.choices[0].message.content;
      return response;
    } catch (e) {
      console.error(`Error during API request (Attempt ${numRetries + 1}):`, e);
      if (numRetries < NUM_MAX_RETRIES - 1) {
        console.log("Retrying...");
      }
    }
  }

  return null;
};

const sendPromptToGPT = async ({
  model,
  prompt,
}: {
  model: string;
  prompt: string;
}): Promise<string | null> => {
  const NUM_MAX_RETRIES = 5;
  
  for (let numRetries = 0; numRetries < NUM_MAX_RETRIES; ++numRetries) {
    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
      });
      const response = completion.choices[0].message.content;
      return response;
    } catch (e) {
      console.error(`Error during API request (Attempt ${numRetries + 1}):`, e);
      if (numRetries < NUM_MAX_RETRIES - 1) {
        console.log("Retrying...");
      }
    }
  }

  return null;
};

const checkImageAvailability = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    return response.ok;
  } catch (e) {
    console.error(`Error checking image availability for ${imageUrl}:`, e);
    return false;
  }
};

export { sendImgURLAndPromptToGPT, checkImageAvailability, sendPromptToGPT };
