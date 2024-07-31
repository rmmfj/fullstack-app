// outfit-matching.ts
import { ResultTable } from '@/type';
import { createClient } from "@/utils/supabase/server";

const semanticSearch = async (suggestion_id: number, suggested_label_string: string, max_num_item: number): Promise<ResultTable[]> => {
    /* TODO: This server action handles the matching process of a single string of labels to multiple items by utilizing the supabase API.
       Also, you should save the distance between suggested_label_string and the items’ label_strings.
       Implement your Supabase semantic search logic here. */
};

export { semanticSearch };