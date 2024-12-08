"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BRANDS = [
  {
    brandName: 'Roots',
    brandSiteUrl: 'https://www.roots.com.tw/',
  },
  {
    brandName: 'Uniqlo',
    brandSiteUrl: 'https://www.uniqlo.com/tw/zh_TW/',
  },
  {
    brandName: 'H&M',
    brandSiteUrl: 'https://www2.hm.com/zh_asia3/index.html',
  },
  {
    brandName: 'GU',
    brandSiteUrl: 'https://www.gu-global.com/tw/zh_TW/',
  },
  {
    brandName: 'à la sha',
    brandSiteUrl: 'https://www.alasha.com.tw/',
  },
  {
    brandName: 'EDWIN',
    brandSiteUrl: 'https://www.edwin.com.tw/',
  },
  {
    brandName: 'Fifty Percent',
    brandSiteUrl: 'https://www.50-shop.com/Shop/',
  },
  {
    brandName: 'ZARA',
    brandSiteUrl: 'https://www.zara.com/tw/',
  },
  {
    brandName: 'MEIER.Q',
    brandSiteUrl: 'https://www.meierq.com/',
  },
  {
    brandName: 'NET',
    brandSiteUrl: 'https://www.net-fashion.net/',
  },
  {
    brandName: 'PAZZO',
    brandSiteUrl: 'https://www.pazzo.com.tw/',
  },
  {
    brandName: 'lativ',
    brandSiteUrl: 'https://www.lativ.com.tw/search/index',
  },
]

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";




const BrandSection = () => {
  return (
    <section id='testimonial' className='py-20 w-full bg-gray-100'>
      <div className='max-w-[85vw] container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>品牌齊聚</h2>
        <p className='text-gray-600 text-center mb-12'>
          從國際潮流到本地精品，整合多家知名服飾品牌，
          <br />
          讓您輕鬆探索更多選擇，找到屬於您的穿搭風格。
        </p>
        <div className="w-full flex items-center justify-center">
          <div className='w-fit grid grid-cols-4 gap-x-4 gap-y-4 md:gap-x-8 md:gap-y-8'>
            {BRANDS.map((brand) => (
              <div
                key={`brand-${brand.brandName.replace(' ', '').toLowerCase()}-logo`}
                className="flex items-center justify-center"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={brand.brandSiteUrl} target="_blank">
                        <Avatar className='cursor-pointer h-16 w-16 md:h-24 md:w-24 rounded-none'>
                          <AvatarImage
                            src={`/image/logo/${brand.brandName.replace(' ', '').toLowerCase()}.png`}
                            alt={`${brand.brandName}'s Logo`}
                          />
                          <AvatarFallback>{brand.brandName}</AvatarFallback>
                        </Avatar>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{brand.brandName}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
