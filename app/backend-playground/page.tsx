"use server";

import { handleDatabaseError } from "@/actions/activity";
import { getLabelStringForImageSearch } from "@/actions/search";



export default async function Playground2() {
  try {
    // const e = handleDatabaseError("No series found for the given series IDs", "getRecommendationRecordById");
    // const favorite = await handleFavorite("64d2474a-2ac8-4775-ab5e-2c8a31bb037c", "0475159c-a171-464e-9d09-733839340744");
    // const favorite2 = await handleFavorite("64d2474a-2ac8-4775-ab5e-2c8a31bb037c", "c3fa429a-e49c-471a-b67f-c5cedb5e1cb4");
    // const result = await getFavoriteByUserId("64d2474a-2ac8-4775-ab5e-2c8a31bb037c");
    // console.log(result);
    // let bottom_url = "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-0eb75e81-a0d5-4a46-8007-c0a16e28c224";
    // let top_url = "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-00ee47f4-8768-42d9-b68b-29a0702243ea"
    // const labelString = await getLabelStringForImageSearch(undefined, "gpt-4o-mini", bottom_url);
    // console.log("backend: ", labelString);
    // const result = await handleImageSearch(labelString, "female", 1, 500, 700, ["H&M", "UNIQLO"], "top");
    // console.log(result);
    

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
