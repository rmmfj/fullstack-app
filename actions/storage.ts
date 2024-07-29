"use server";

import { v4 as uuidv4 } from "uuid";

import { createClient } from "@/utils/supabase/server";

const storeImageToStorage = async (base64: string): Promise<string> => {
  const supabase = createClient();
  const filename = uuidv4();
  await supabase.storage
    .from("avatar")
    .upload(
      filename,
      Buffer.from(base64.replace(/data:image\/([^;]+);base64,/, ""), "base64")
    );
  /* Retrieve avatar URL */
  const {
    data: { publicUrl },
  } = supabase.storage.from("image").getPublicUrl(filename);
  /* Upload picture to supabase storage */
  return publicUrl;
};

const listStorageImageUrls = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("image").list();
  if (error) {
    throw new Error(`Error fetching storage files: ${error.message}`);
  }
  return data?.map((storageImage) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from("image").getPublicUrl(storageImage.name);
    return publicUrl;
  });
};

export { listStorageImageUrls, storeImageToStorage };
