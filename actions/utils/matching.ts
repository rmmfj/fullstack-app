"use server";
import { Gender } from "@/type";
import supabase from "@/lib/supabaseClient";
import { calculateDistance, generateEmbedding } from "./embedding";

export interface UnstoredResult {
  distance: number;
  item_id: number;
  suggestion_id: number;
}

// Function to perform semantic search using Supabase API
const semanticSearch = async ({
  suggestionId,
  suggestedLabelString,
  numMaxItem,
  gender = "male",
}: {
  suggestionId: number;
  suggestedLabelString: string;
  numMaxItem: number;
  gender: Gender;
}): Promise<UnstoredResult[] | null> => {
  try {
    const suggestedEmbedding = await generateEmbedding(suggestedLabelString);

    const rpcFunctionName = `query_similar_${gender}_items`;

    const { data: similarItems, error: err } = await supabase.rpc(
      rpcFunctionName,
      {
        query_embedding: suggestedEmbedding,
        match_threshold: 0.2,
        max_item_count: numMaxItem,
      }
    );
    
    if (err) {
      console.error("Error fetching results from Supabase:", err);
      return null;
    }

    const results: UnstoredResult[] = similarItems.map((item: { id: any; }, index: any) => ({
      distance: index, // SQL Editor Sort 完直接用 (?)
      item_id: item.id,
      suggestion_id: suggestionId,
    }));

    return results;
  } catch (error) {
    console.error("Error in semanticSearch:", error);
    return null;
  }
};

export { semanticSearch };
