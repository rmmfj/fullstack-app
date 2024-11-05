"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Series } from "@/type";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ItemCard from "./item-card";

const parseTags = (stylePreferencesString: string) => {
  return stylePreferencesString.split(",");
};

const ItemList = ({
  title,
  id,
  series,
  index,
  description,
  expandOnMount=false,
  expandable=true,
}: {
  title: string;
  id: string;
  series: Series[];
  index: number;
  description: string;
  expandOnMount?: boolean;
  expandable?: boolean,
}) => {
  const [isExpanded, setIsExpanded] = useState(expandOnMount || false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const router = useRouter();

  return (
    <div
      id={id}
      className={cn(
        "px-4 flex flex-col gap-6 items-center",
        index !== 0 && "border-t-[1px] border-gray-800/30",
        title ? 'pt-6' : 'pt-0'
      )}
    >
      <h3 className='text-2xl font-semibold text-primary border-b-2 border-indigo-400'>{title}</h3>
      {description && (
        <p className='text-center italic text-gray-600 m-4'>
          {`「${description}」`}
        </p>
      )}

      <div className='flex gap-4 flex-wrap items-start justify-center'>
        {(isExpanded ? series : series.slice(0, 4)).map((s) => {
          return <ItemCard series={s} key={`item-card-${s.items[0].id}`} />;
        })}
      </div>

      {expandable && !isExpanded && series.length > 4 && (
        <Button className='bg-gray-400 hover:bg-gray-300' onClick={toggleExpand}>
          展開列表
        </Button>
      )}
      {expandable && isExpanded && series.length > 4 && (
        <Button className='bg-gray-400 hover:bg-gray-300' onClick={toggleExpand}>
          收起列表
        </Button>
      )}
    </div>
  );
};

export default ItemList;
