// utils.ts
import openai from "@/utils/openai";
import { ImageURL } from "openai/resources/beta/threads/messages";

const chatCompletionTextAndImage = async (model: string, prompt: string, image_url: ImageURL): Promise<string | null> => {
    /* TODO: Using OpenAI API to get your response with a text and an image input.
       This server action purely takes your input and sends to GPT model to get your response. */
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: image_url },
            ] }],
        });
        const response = completion.choices[0].message.content;
        return response;
    } catch (e) {
        console.log("Failed to get response from GPT API.");
        console.log(e);
        return null;
    };
};

const chatCompletionTextOnly = async (model: string, prompt: string): Promise<string | null >=> {
    /* TODO: Using OpenAI API to get your response with only a text input.
       This server action purely takes your input and sends to GPT model to get your response. */
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: prompt }],
        });
        const response = completion.choices[0].message.content;
        return response;
    } catch (e) {
        console.log("Failed to get response from GPT API.");
        console.log(e);
        return null;
    };
};

export { chatCompletionTextAndImage, chatCompletionTextOnly };