"use server";
import { ClothingType, ValidatedRecommendation } from "@/type";

const validateLabelString = (
  recommendations: string,
  clothingType?: ClothingType
): ValidatedRecommendation[] => {
  try {
    console.log("Received recommendations string:", recommendations);

    if (typeof recommendations !== "string") {
      console.log("stop bc recommendations is not a string");
      return [];
    }

    const cleanedRecommendations = recommendations.replace(/```json\s*|\s*```/g, "").trim();

    if (!cleanedRecommendations.startsWith("[")) {
      console.log("stop bc cleaned recommendations does not start with '['");
      return [];
    }

    const recommendationsArray = JSON.parse(cleanedRecommendations);
    if (!Array.isArray(recommendationsArray)) {
      console.log("stop bc parsed recommendations is not an array");
      return [];
    }

    const requiredKeys = ["顏色", "服裝類型", "剪裁版型", "設計特點", "材質", "細節"];

    const hasBaseInfo = recommendationsArray.every((rec) =>
      requiredKeys.every((key) => key in rec.item)
    );

    if (!hasBaseInfo) {
      console.log("stop bc not all items contain required keys");
      return [];
    }

    const cleanedLabel = recommendationsArray
      .filter((rec) => requiredKeys.every((key) => key in rec.item))
      .map((rec) => ({
        styleName: rec.styleName || "",
        description: rec.description || "",
        labelString: generateLabelString(rec, clothingType),
      }));

    return cleanedLabel;
  } catch (error) {
    console.error("Error in validateRecommendation:", error);
    return [];
  }
};

const generateLabelString = (
  rec: { item: { [key: string]: string } },
  clothingType?: ClothingType
): string => {
  const baseInfo = `顏色: ${rec.item.顏色}, 服裝類型: ${rec.item.服裝類型}, 剪裁版型: ${rec.item.剪裁版型}, 設計特點: ${rec.item.設計特點}, 材質: ${rec.item.材質}, 細節: ${rec.item.細節}`;

  let specificInfo = "";
  if (clothingType === "top") {
    specificInfo = `褲管: ${rec.item.褲管 || "N/A"}, 裙擺: ${rec.item.裙擺 || "N/A"}`;
  } else if (clothingType === "bottom") {
    specificInfo = `領子: ${rec.item.領子 || "N/A"}, 袖子: ${rec.item.袖子 || "N/A"}`;
  } else {
    specificInfo = `褲管: ${rec.item.褲管 || "N/A"}, 裙擺: ${rec.item.裙擺 || "N/A"}, 領子: ${rec.item.領子 || "N/A"}, 袖子: ${rec.item.袖子 || "N/A"}`;
  }

  return `${baseInfo}, ${specificInfo}`;
};

export { validateLabelString };