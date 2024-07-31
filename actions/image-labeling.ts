import { ImageURL } from "openai/resources/beta/threads/messages";

// image-labeling.ts
const extractLabelsFromImage = async (image_url: ImageURL): Promise<string> => {
    /* TODO: The whole process of extracting labels from an image.
       You should utilize validateResponseFormat() to make sure your output has the correct format. */
};

const validateResponseFormat = (image_label_string: string): Promise<boolean> => {
    /* TODO: Validate the format of the response you get from GPT.
       Implement your validation logic here. */
};

export { extractLabelsFromImage, validateResponseFormat };