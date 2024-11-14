"use server";
import { ClothingType, Gender } from "@/type";

const constructPromptForRecommendation = ({
  clothingType,
  gender,
  numMaxSuggestion,
}: {
  clothingType: ClothingType;
  gender: Gender;
  numMaxSuggestion: number;
}): string => {
  const prompt: string = `
    請擔任我的造型師，仔細觀察這張圖片中性別為
    ${gender}的
    ${clothingType === "top" ? "上衣" : "下身類衣物"}
    ，請推薦${numMaxSuggestion}種與之搭配的
    ${clothingType === "top" ? "下身類衣物" : "上衣"}。
    對於每一種搭配，請提供一個風格名稱和推薦的原因，若對於某一種風格並沒有想要特別指定顏色的話，可以於顏色的欄位中標示為“無限制”。
    請使用下方 JSON 格式回覆，回答無需包含其他資訊：
    [
      {
        "styleName": "[風格名稱]",
        "description": "[推薦原因]",
        "item": {
          "顏色": "[顏色]", 
          "服裝類型": "[類型]", 
          "剪裁版型": "[描述]", 
          "設計特點": "[描述]", 
          "材質": "[材質]", 
          "細節": "[描述]", 
          ${
            clothingType === "top"
              ? '"褲管": "[描述]", "裙擺": "[描述]"'
              : '"領子": "[描述]", "袖子": "[描述]"'
          }
        }
      }
    ]
  `;
  return prompt;
};

const constructPromptForImageSearch = ({
  gender,
}: {
  gender: Gender;
}): string => {
  const prompt: string = `
    請仔細觀察這張圖片中性別為${gender}的
    衣物，並且提供一組詳盡的描述。
    同時判斷衣物的類型 (上半身或下半身)。
    請使用下方 JSON 格式回覆，回答無需包含其他資訊：
    [
      {
        "item": {
          "顏色": "[顏色]", 
          "服裝類型": "[類型]", 
          "剪裁版型": "[描述]", 
          "設計特點": "[描述]", 
          "材質": "[材質]", 
          "細節": "[描述]", 
          "領子": "[描述]", //選填
          "袖子": "[描述]", //選填
          "褲管": "[描述]", //選填
          "裙擺": "[描述]" //選填
        },
        "clothing_type": "[上半身/下半身]"
      }
    ]
  `;
  return prompt;
};

const constructPromptForTextSearch = ({
  query,
  gender,
}: {
  query: string;
  gender: Gender;
}): string => {
  return `
    請參考這位性別為${gender}的使用者的需求：${query}。
    若是使用者的需求中沒有特別註明關於顏色的敘述，顏色可以為“無限制”。
    同時判斷衣物的類型 (上半身或下半身)。
    請使用下方 JSON 格式回覆，回答無需包含其他資訊：
    [
      {
        "item": {
          "顏色": "[顏色]",
          "服裝類型": "[類型]", 
          "剪裁版型": "[描述]", 
          "設計特點": "[描述]", 
          "材質": "[材質]", 
          "細節": "[描述]", 
          "領子": "[描述]", //選填
          "袖子": "[描述]", //選填
          "褲管": "[描述]", //選填
          "裙擺": "[描述]" //選填
        },
        "clothing_type": "[上半身/下半身]"
      }
    ]
  `;
};

export {
  constructPromptForImageSearch,
  constructPromptForRecommendation,
  constructPromptForTextSearch,
};