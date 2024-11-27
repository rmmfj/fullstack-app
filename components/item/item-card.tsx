"use client";

import { Card } from "@/components/ui/card";
import { Series, SimplifiedItemTable } from "@/type";
import { Copy, EllipsisVertical, Heart, ScanText, Shirt, ShoppingBag, TextSearch, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { handleFavorite } from "@/actions/favorite";
import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
} from "@/components/ui/extension/carousel";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "../ui/badge";

const PROVIDER_CLASSNAME_MAPPING: { [k: string]: string } = {
  'UNIQLO': 'bg-blue-100 hover:bg-blue-100 text-gray-800',
  'FIFTY PERCENT': 'bg-rose-100 hover:bg-rose-100 text-gray-800',
  'H&M': 'bg-violet-100 hover:bg-violet-100 text-vigray-800',
  'PAZZO': 'bg-teal-100 hover:bg-teal-100 text-gray-800',
  'Meier.Q': 'bg-fuchsia-100 hover:bg-fuchsia-100 text-gray-800',
  'ZARA': 'bg-amber-100 hover:bg-amber-100 text-gray-800',
  'lativ': 'bg-sky-100 hover:bg-sky-100 text-gray-800',
};  


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "../ui/use-toast";

import { insertActivityItem } from "@/actions/activity";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";

const parseLabelString = (input: string) => {
  const result: { [key: string]: string } = {};
  
  // Split the input string by commas and process each key-value pair
  const pairs = input.split(',').map(item => item.trim());

  pairs.forEach(pair => {
    // Split each pair by the first occurrence of ':'
    const [key, value] = pair.split(/:(.*)/).map(item => item.trim());

    if (key && value) {
      result[key] = value;
    }
  });
  return result;
}

const Label = ({ entry }: { entry: string[] }) => {
  return <div className='flex flex-row w-full items-center gap-4'>
    <Badge className='bg-indigo-300 hover:bg-indigo-300 break-keep'>{entry[0]}</Badge>
    <p className="... truncate">{entry[1]}</p>
  </div>;
}

export function ItemInfoDialog({
  item,
  open,
  setOpen,
}: {
  item: SimplifiedItemTable;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[30rem] max-w-[85vw] h-fit rounded-none md:rounded-none">
        <DialogHeader>
          <DialogTitle>商品資訊</DialogTitle>
          <DialogDescription>
            您可以在此檢視商品詳細資訊。
          </DialogDescription>
        </DialogHeader> 
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className='relative w-40 h-40 md:w-64 md:h-64'>
            <Image
              src={item.image_url as string}
              className='object-cover'
              style={{ objectFit: "cover" }}
              fill
              alt={`Image of product "${item.title}" 0`}
              unoptimized
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Label entry={['性別', item.gender === "male" ? "男性 🙋‍♂️" : "女性 🙋‍♀️"]} />
            <Label entry={['類別', item.clothing_type === "top" ? "上衣 👕" : "下身 👖"]} />
            {
              Object.entries(parseLabelString(item.label_string as string)).map((entry, index) => {
                return <Label key={`label-entry-${index}`} entry={entry} />
              })
            }
          </div>
        </div>
        <DialogFooter className="flex flex-col justify-start gap-2 pt-2">
          <Button
            className="bg-gray-400 font-bold hover:bg-gray-300 flex gap-2 px-6 py-0"
            onClick={() => {
              const labelString = item.label_string as string;
              navigator.clipboard.writeText(labelString);
              toast({
                title: '已將商品敘述複製至剪貼簿',
                description: labelString
              });
            }}
          >
            <Copy className="w-4 h-4" />
            複製
          </Button>
          <Button
            className="bg-indigo-400 font-bold hover:bg-indigo-300 flex gap-2 px-6 py-0"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <X className="w-4 h-4" />
            關閉
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function MoreOptions({ children, item }: { children: React.ReactNode, item: SimplifiedItemTable }) {
  
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          { children }
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit bg-gray-50 border-0 shadow-none text-gray-500">
          <DropdownMenuLabel className="text-gray-700">進階動作</DropdownMenuLabel>
          <Link href={item.external_link as string} target="_blank">
            <DropdownMenuItem className="gap-2 cursor-pointer hover:bg-gray-200">
              <ShoppingBag className="w-4 h-4" />
              <span>前往商場購買</span>
            </DropdownMenuItem>
          </Link>
          <Link href={`/search?title=${item.title}&gender=${item.gender}&label_string=${item.label_string}`}>
            <DropdownMenuItem className="gap-2 cursor-pointer hover:bg-gray-200">
              <TextSearch className="w-4 h-4" />
              <span>尋找類似單品</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="gap-2 cursor-pointer hover:bg-gray-200">
            <Shirt className="w-4 h-4" />
            <span>進行穿搭推薦</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialogOpen(true)} className="gap-2 cursor-pointer hover:bg-gray-200">
            <ScanText className="w-4 h-4" />
            <span>查看商品細節</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ItemInfoDialog item={item} open={dialogOpen} setOpen={setDialogOpen} />
    </>
  )
}


const ItemCard = ({ series, userId }: { series: Series, userId?: string | null }) => {

  const [isFavorite, setIsFavorite] = useState<boolean>(series.isFavorite);

  const toggleFavorite = async () => {
    if (!userId) return;
    setIsFavorite(!isFavorite);
    await handleFavorite(userId, series.items[0].series_id);
  }

  const recordActivity = (activityType: string) => (async () => {
    console.log('activitiy item')
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await insertActivityItem(user?.id as string, series.items[0].id, activityType);
  });
  
  return (
    <Card className='w-40 md:w-64 rounded-none flex flex-col justify-between h-fit gap-1 shadow-none border-0'>
      <div className='relative inline-block w-full h-full'>
        {
          series.items.length > 0 &&
          <Badge className={cn(
            'border-0 shadow-none absolute top-0 left-0 m-2 z-10',
            PROVIDER_CLASSNAME_MAPPING[series.items[0].provider as string]
          )}>
            {series.items[0].provider}
          </Badge>
        }
        {series.items.length > 1 ? (
          <Carousel>
            <CarouselNext />
            <CarouselPrevious />
            <div className='relative w-full'>
              <Link
                target="_blank"
                onClick={recordActivity('click_see_more')}
                href={
                  series.items[0].external_link ? series.items[0].external_link : "#"
                }
              >
                <CarouselMainContainer className='h-full w-full'>
                  {series.items.map((item, index) => (
                    <SliderMainItem key={item.id} className='bg-transparent'>
                      <div className='relative w-full h-40 md:h-64'>
                        <Image
                          src={item.image_url as string}
                          className='object-cover'
                          style={{ objectFit: "cover" }}
                          fill
                          alt={`Image of product "${item.title}" ${index}`}
                          unoptimized
                        />
                      </div>
                    </SliderMainItem>
                  ))}
                </CarouselMainContainer>
              </Link>
              <div className='relative w-40 md:w-64 bottom-2 left-1/2 -translate-x-1/2'>
                <CarouselThumbsContainer onClick={recordActivity('switch_color')} className='gap-x-1'>
                  {series.items.map((_, index) => (
                    <CarouselIndicator
                      key={index}
                      index={index}
                    />
                  ))}
                </CarouselThumbsContainer>
              </div>
            </div>
          </Carousel>
        ) : (
          <div className='relative w-full h-40 md:h-64'>
            <Link
              target="_blank"
              onClick={recordActivity('click_see_more')}
              href={
                series.items[0].external_link ? series.items[0].external_link : "#"
              }
            >
              <Image
                src={series.items[0].image_url as string}
                className='object-cover'
                style={{ objectFit: "cover" }}
                fill
                alt={`Image of product "${series.items[0].title}" 0`}
                unoptimized
              />
            </Link>
          </div>
        )}
      </div>
      <Link
        target="_blank"
        onClick={recordActivity('click_see_more')}
        href={
          series.items[0].external_link ? series.items[0].external_link : "#"
        }
      >
        <h3 className='py-2 text-md underline break-words ...'>
          {series.items[0].title}
        </h3>
      </Link>
      <div className='pb-2 flex justify-between'>
        <p>NTD {series.items[0].price as number}</p>
        <div className='flex justify-end gap-1'>
          <motion.button whileTap={{ scale: 0.9 }} disabled={userId === null}>
            <Heart onClick={toggleFavorite} className={cn(userId !== null ? 'text-rose-300' : 'text-rose-300/30')} {...(isFavorite ? { fill: '#fca5a5' } : { })} />
          </motion.button>
          <MoreOptions item={series.items[0]}>
            <motion.button whileTap={{ scale: 0.9 }}>
              <EllipsisVertical className='text-gray-500' />
            </motion.button>
          </MoreOptions>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
