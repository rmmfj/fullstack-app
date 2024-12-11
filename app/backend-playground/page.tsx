"use client";

import openai from "@/utils/openai";
import prisma from "@/prisma/db";

interface Item {
  id: string;
  embedding: number[];
}

// Fetch items from the database based on IDs
const fetchItems = async (ids: string[]): Promise<Item[]> => {
  const items: Item[] = await prisma.$queryRawUnsafe(`
    SELECT id, embedding
    FROM item
    WHERE id = ANY($1)
  `, ids);
  return items;
};

const fetchSimilarItems = async (targetEmbedding: number[], itemIds: string[]) => {
  const targetEmbeddingStr = `[${targetEmbedding.join(',')}]`;

  const items = await fetchItems(itemIds);

  const result = await prisma.$queryRawUnsafe<{
    id: string;
    embedding: number[];
    similarity: number;
  }[]>(`
    SELECT id, embedding::vector <#> CAST('${targetEmbeddingStr}' AS vector) AS similarity
    FROM item
    WHERE id = ANY($1)
    ORDER BY similarity DESC
  `, itemIds);

  // Return the result with similarity score
  return result.map((item: { id: string, embedding: number[], similarity: number }) => ({
    id: item.id,
    similarity: item.similarity,  // Convert distance to similarity
  }));
};

// Generate embedding from OpenAI model
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

export default async function Playground2() {
  try {
    const labelString = "顏色: 無限制, 服裝類型: 上衣, 剪裁版型: 合身, 設計特點: 菱格紋, 材質: 棉混紡, 細節: 無口袋設計, 領子: 圓領, 袖子: 長袖";

    // List of item IDs to search for similar items
    const itemIds = [
      '96961199-4a07-447e-b12b-52d9d2d0217b',
      '6028e538-8304-4140-b1c8-e0a886b55bf8',
      'd7e5117f-5353-4e8f-bf75-c3bdbf9b06a7',
      '4be5de39-accd-40cc-92ed-f0b4ca506766',
      '3fa75e2a-a52b-4ce9-a14e-07036b32ce0e',
      '4193e078-baea-4558-84e2-5ad4016549ff',
      '000d83a3-12d2-4751-947c-a781ef513959', // 隨便褲子
      '0ba604d6-9fc9-49a7-b7c4-2060ee159d02' //第一名
    ];

    // Generate the embedding for the label string
    const targetEmbedding = await generateEmbedding(labelString);
    console.log("target embedding's head only: ", targetEmbedding?.slice(0, 5));

    if (!targetEmbedding) {
      console.error("Failed to generate embedding.");
      return;
    }

    // Fetch similar items based on the target embedding using <#> similarity
    const similarItems = await fetchSimilarItems(targetEmbedding, itemIds);

    console.log("Similar items:", similarItems);

  } catch (error) {
    console.error("Error during backend function calls", error);
  }

  return (
    <div>
      <h1>Playground2</h1>
      <p>Check console for output</p>
    </div>
  );
}
