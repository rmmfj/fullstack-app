"use server";

import { handleFavorite, isFavorite } from "@/actions/favorite";
import { handleRecommendationWithoutLogin, handleTextSearch } from "@/actions/upload";

export default async function Playground2() {
  try {
    // test handleImageSearch, handleTextSearch
    // const result = await handleTextSearch("請給藍色襯衫", "gpt-4o-mini", "male", 3, 0, 1000, undefined, "top", "64d2474a-2ac8-4775-ab5e-2c8a31bb037c");
    // console.log("result:", result);
    // const fav = await handleFavorite("64d2474a-2ac8-4775-ab5e-2c8a31bb037c", "f0785f6d-1fed-4186-be70-13512acf8cc3");
    // console.log(fav);
    
    

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
