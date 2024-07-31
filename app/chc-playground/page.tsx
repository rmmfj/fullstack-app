"use server";

import{
    handleSuggestionMatching, handleInputToSuggestions, handleRequest
} from "@/actions/process-handler";

export default async function Playground() {
  const user_id = "92a75107-0564-4dae-8be0-29665aaccf2b";

  //test react
  // try {
  //     const reaction = await reactToPost(new_user_id, post_id, reaction_type);
  //     console.log("new reaction", reaction);

  // } catch (error) {
  //     console.error("Error during backend function calls", error);
  // }

  return (
    <div>
      <h1>Playground2</h1>
      <p>Check console for output</p>
    </div>
  );
}
