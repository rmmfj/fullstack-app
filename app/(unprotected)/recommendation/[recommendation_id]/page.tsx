"use server";

import { getRecommendationRecordById } from "@/actions/recommendation";
import ItemList from "@/components/item/item-list";
import { Button } from "@/components/ui/button";
import { Recommendation } from "@/type";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import UserInfoCard from "./user-info-card";

interface RecommendationPageProps {
  params: Promise<{ recommendation_id: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

const RecommendationPage = async ({
  params,
  searchParams,
}: RecommendationPageProps) => {
  const { recommendation_id } = await params;
  const supabase = createClient();
  // Get the user data
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const recommendation: Recommendation = (await getRecommendationRecordById(
    recommendation_id,
    user !== null ? user.id : null
  )) as Recommendation;
  if (!recommendation)
    return (
      <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
        <p className="text-red-400 font-bold">
          你沒有權限訪問別人的推薦結果唷！
        </p>
        <Link href="/home">
          <Button variant="destructive">回到首頁</Button>
        </Link>
      </div>
    );
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="py-10 w-full flex gap-4 flex-col items-center justify-center">
        <h2 className="text-lg text-muted-foreground">您上傳的衣服</h2>
        <UserInfoCard
          imageUrl={recommendation.imageUrl}
          gender={recommendation.gender}
        />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center md:max-w-[80vw]">
        {Object.keys(recommendation.styles).map((recommendedStyle, index) => {
          console.log(recommendation.styles[recommendedStyle].series);
          return (
            <ItemList
              key={`recommended-style-${index}`}
              id={recommendation.styles[recommendedStyle].suggestion_id as number}
              index={index}
              title={recommendedStyle}
              description={recommendation.styles[recommendedStyle].description}
              series={recommendation.styles[recommendedStyle].series}
              expandable={true}
            />
          );
        })}
      </div>
      <br />
      {/* <FeedbackCard /> */}
    </div>
  );
};

export default RecommendationPage;
