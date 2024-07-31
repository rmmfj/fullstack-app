// param.ts
"use server";
import { createClient } from "@/utils/supabase/server";
import { ClothingType, ParamTable, UploadTable } from "@/type";
import { v4 as uuidv4 } from "uuid";
import { ImageURL } from "openai/resources/beta/threads/messages";

const getParamById = async (param_id: number): Promise<ParamTable | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("param")
      .select("*")
      .eq("id", param_id)
      .single();
    if (error) {
      console.error("Error fetching item:", error);
      return null;
    }
    return data as ParamTable;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

const insertParam = async (
  height: number | null,
  clothing_type: ClothingType,
  style_preferences: string | null
): Promise<number> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("param")
    .insert([{ height, clothing_type, style_preferences }])
    .select("id");
  if (error) {
    console.log(error);
  }
  if (data && data.length > 0) {
    const param_id = data[0].id;
    return param_id as number;
  } else {
    return -1;
  }
};

const deleteParamById = async (param_id: number) => {
  const supabase = createClient();
  const response = await supabase.from("param").delete().eq("id", param_id);
  console.log(response);
  return;
};

const getUploadById = async (
  upload_id: number
): Promise<UploadTable | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("upload")
      .select("*")
      .eq("id", upload_id)
      .single();
    if (error) {
      console.error("Error fetching item:", error);
      return null;
    }
    return data as UploadTable;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

const insertUpload = async (
  image_url: ImageURL,
  label_string: string,
  user_id: number
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("upload")
    .insert([{ image_url, label_string, user_id }])
    .select("id");
  if (error) {
    console.log(error);
  }
  if (data && data.length > 0) {
    const upload_id = data[0].id;
    return upload_id as number;
  } else {
    return -1;
  }
};

const deleteUploadById = async (upload_id: number) => {
  const supabase = createClient();
  const response = await supabase.from("upload").delete().eq("id", upload_id);
  console.log(response);
  return;
};

export {
  getParamById,
  insertParam,
  deleteParamById,
  getUploadById,
  insertUpload,
  deleteUploadById,
};
