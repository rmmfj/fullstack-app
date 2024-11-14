"use server";
import { ClothingType, ValidatedRecommendation } from "@/type";

const validateLabelString = (
  recommendations: string,
  isSimilar: boolean,
  clothingType?: ClothingType,
): ValidatedRecommendation[] => {
  try {
    // console.log("Received recommendations string:", recommendations);

    if (typeof recommendations !== "string") {
      console.log("Recommendations is not a string:", recommendations);
      return [];
    }

    const cleanedRecommendations = recommendations.replace(/```json\s*|\s*```/g, "").trim();

    if (!cleanedRecommendations.startsWith("[")) {
      console.log("Cleaned recommendations does not start with '[':", cleanedRecommendations);
      return [];
    }

    let recommendationsArray;
    try {
      recommendationsArray = JSON.parse(cleanedRecommendations);
    } catch (parseError) {
      console.error("Failed to parse recommendations JSON:", parseError);
      return [];
    }

    if (!Array.isArray(recommendationsArray)) {
      console.log("Parsed recommendations is not an array:", recommendationsArray);
      return [];
    }

    const requiredKeys = ["顏色", "服裝類型", "剪裁版型", "設計特點", "材質", "細節"];

    const hasBaseInfo = recommendationsArray.every((rec) =>
      rec.item && requiredKeys.every((key) => key in rec.item)
    );

    if (!hasBaseInfo) {
      console.log("Not all items contain the required keys.");
      return [];
    }

    const cleanedLabel = recommendationsArray
      .filter((rec) =>  rec.item &&requiredKeys.every((key) => key in rec.item))
      .map((rec) => ({
        styleName: rec.styleName || "",
        description: rec.description || "",
        labelString: generateLabelString(rec, isSimilar, clothingType),
      }));

    return cleanedLabel;
  } catch (error) {
    console.error("Error in validateLabelString:", error);
    return [];
  }
};

const generateLabelString = (
  rec: { item: { [key: string]: string } },
  isSimilar: boolean,
  clothingType?: ClothingType,
): string => {
  const baseInfo = `顏色: ${rec.item.顏色}, 服裝類型: ${rec.item.服裝類型}, 剪裁版型: ${rec.item.剪裁版型}, 設計特點: ${rec.item.設計特點}, 材質: ${rec.item.材質}, 細節: ${rec.item.細節}`;

  let specificInfo = "";
  if (isSimilar) {
    if (clothingType === "top") {
      specificInfo = `領子: ${rec.item.領子 ?? "N/A"}, 袖子: ${rec.item.袖子 ?? "N/A"}`;
    } else if (clothingType === "bottom") {
      specificInfo = `褲管: ${rec.item.褲管 ?? "N/A"}, 裙擺: ${rec.item.裙擺 ?? "N/A"}`;
    } else {
      specificInfo = `褲管: ${rec.item.褲管 ?? "N/A"}, 裙擺: ${rec.item.裙擺 ?? "N/A"}, 領子: ${rec.item.領子 ?? "N/A"}, 袖子: ${rec.item.袖子 ?? "N/A"}`;
    }
  } else {
    if (clothingType === "top") {
      specificInfo = `褲管: ${rec.item.褲管 ?? "N/A"}, 裙擺: ${rec.item.裙擺 ?? "N/A"}`;
    } else if (clothingType === "bottom") {
      specificInfo = `領子: ${rec.item.領子 ?? "N/A"}, 袖子: ${rec.item.袖子 ?? "N/A"}`;
    } else {
      specificInfo = `褲管: ${rec.item.褲管 ?? "N/A"}, 裙擺: ${rec.item.裙擺 ?? "N/A"}, 領子: ${rec.item.領子 ?? "N/A"}, 袖子: ${rec.item.袖子 ?? "N/A"}`;
    }
  }
  return `${baseInfo}, ${specificInfo}`;
};

export { validateLabelString };