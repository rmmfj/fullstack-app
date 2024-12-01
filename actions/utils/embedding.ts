"use server";
import openai from "@/utils/openai";
import prisma from "@/prisma/db";

interface Item {
  id: string;
  label_string: string;
  embedding?: number[] | null;
}

const getAllItems = async (start: number = 1000, end: number = 2000): Promise<Item[] | null> => {
  try {
    const items = await prisma.item.findMany({
      select: {
        id: true,
        label_string: true,
      },
      skip: start,
      take: end - start + 1,
    });
    
    const sanitizedItems = items.map(item => ({
      id: item.id,
      label_string: item.label_string ?? "",
    }));

    return sanitizedItems.length > 0 ? sanitizedItems : null;
  } catch (error) {
    console.error("Error getting items:", error);
    return null;
  }
};

const generateEmbedding = async (text: string): Promise<number[] | null> => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
};

const handler = async (): Promise<void> => {
  try {
    // Find all items where 'embedding' is null
    const items = await prisma.item.findMany({
      where: { embedding: null },
      select: {
        id: true,
        label_string: true,
      },
      take: 500,
    });

    console.log("meow")

    if (items.length > 0) {
      const updates = items.map(async (item) => {
        // Check if label_string is not null before generating the embedding
        if (item.label_string !== null) {
          const embedding = await generateEmbedding(item.label_string);

          if (embedding) {
            try {
              // Update the embedding for the item
              await prisma.item.update({
                where: { id: item.id },
                data: { embedding: JSON.stringify(embedding)  },
              });
            } catch (error) {
              console.error(`Error updating embedding for item ${item.id}:`, error);
            }
          } else {
            console.error(`Error generating embedding for item ${item.id}`);
          }
        } else {
          console.error(`label_string is null for item ${item.id}`);
        }
      });

      await Promise.all(updates);
    }
  } catch (error) {
    console.error("Error generating embeddings:", error);
  }
};


const calculateDistance = (
  embedding1: number[] | string,
  embedding2: number[]
): number => {
  const emb1 = Array.isArray(embedding1) ? embedding1 : JSON.parse(embedding1);

  if (!Array.isArray(emb1) || !Array.isArray(embedding2)) {
    throw new TypeError("Both embeddings should be arrays");
  }

  if (emb1.length !== embedding2.length) {
    throw new Error("Embeddings must have the same length");
  }

  return 1 - emb1.reduce((sum, value, index) => sum + value * embedding2[index], 0);
};

export { calculateDistance, generateEmbedding, getAllItems, handler };
