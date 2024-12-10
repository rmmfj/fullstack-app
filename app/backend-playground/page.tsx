"use client";

import { handleDatabaseError } from "@/actions/activity";
import { getLabelStringForTextSearch } from "@/actions/search";
import { handler } from "@/actions/utils/embedding";


export default async function Playground2() {
  try {
    // const favorite = await handleFavorite("64d2474a-2ac8-4775-ab5e-2c8a31bb037c", "0475159c-a171-464e-9d09-733839340744");
    // const favorite2 = await handleFavorite("64d2474a-2ac8-4775-ab5e-2c8a31bb037c", "c3fa429a-e49c-471a-b67f-c5cedb5e1cb4");
    // const result = await getFavoriteByUserId("64d2474a-2ac8-4775-ab5e-2c8a31bb037c");
    // console.log(result);
    // const labelString = await getLabelStringForTextSearch("male", "gpt-4o-mini", "請給我兒童色情");
    // console.log("backend: ", labelString);
    // const result = await handleImageSearch(labelString, "female", 1, 500, 700, ["H&M", "UNIQLO"], "top");
    // console.log(result);
    

  // } catch (error) {
  //   console.error("Error during backend function calls", error);
  // }

  const generateEmbedding = async () => {
    await handler();
  }

  return (
    <div>
      <h1>Playground2</h1>
      <p>Check console for output</p>
      <button onClick={generateEmbedding}>generateEmbedding</button>
    </div>
  );
} catch {
  console.log("error");
}
}