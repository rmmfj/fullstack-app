"use client";

import { RecommendationPreview } from "@/type";
import { useRouter } from "next/navigation";
import PreviewCard from "./preview-card";


const PreviewList = ({
  title,
  previews,
  description,
}: {
  title: string;
  previews: RecommendationPreview[];
  description: string;
}) => {
  const router = useRouter();

  return (
    <div
      className="w-full px-4 flex flex-col gap-6 items-center pt-6"
    >
      <h3 className='text-2xl font-semibold text-primary border-b-2 border-indigo-400'>{title}</h3>
      {description && (
        <p className='text-center italic text-gray-600 m-4'>
          {`「${description}」`}
        </p>
      )}

      <div className='flex gap-4 flex-wrap items-start justify-center'>
        {previews.map((p) => {
          return <PreviewCard preview={p} key={`preview-card-${p.id}`} />;
        })}
      </div>
    </div>
  );
};

export default PreviewList;
