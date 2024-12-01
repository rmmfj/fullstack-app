"use client";

import { getLabelStringForTextSearch, handleSearch } from "@/actions/search";
import ItemList from "@/components/item/item-list";
import ItemListSkeleton from "@/components/item/item-list-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Gender, Series } from "@/type";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";


import PaginationBar from "@/components/pagination-bar";
import TourButton from "@/components/tour-button";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { MultiSelect } from "@/components/multi-select";

const schema = z.object({
  uploadedImage: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList, {
        message: "請上傳圖片",
      })
  ).refine((files) => files.length > 0, "請上傳圖片"),
});

const searchQueriesDescription = [
  "請給我一件寬鬆、舒適的長褲。",
  "我想要一件合身的西裝。",
  "尋找一件適合運動的T恤。",
  "給我一件風格簡約的襯衫。",
  "找一件有條紋圖案的針織毛衣。",
  "想要一件適合商務場合的黑色長褲。",
  "推薦一件適合約會的浪漫風格裙子。",
];

const searchQueriesSituation = [
  "我今天想去野餐，請推薦給我適合戶外活動的上衣。",
  "我要去參加朋友的婚禮，請推薦一件典雅的長裙。",
  "我想找一件適合週末郊遊的輕便外套。",
  "今天我想去健身房，請給我一套運動服裝。",
  "幫我找一件適合正式場合穿的白襯衫。",
  "我需要一條適合夏日海灘穿的短褲。",
  "找一件可以搭配牛仔褲的休閒T恤。",
  "推薦一件適合寒冷天氣穿的高領毛衣。",
  "我接下來要參加會議，請推薦一件合身的黑色西裝外套。",
];

const searchQueriesType = [
  "我想要一件街頭風格的灰色T恤。",
  "推薦一件復古風格的格子襯衫。",
  "我需要一件適合極簡風格的白色寬褲。",
  "推薦一件日系風格的寬鬆連帽外套。",
  "我想要一條適合優雅風格的高腰長褲。",
  "幫我找一件美式休閒風的連帽T恤。",
  "推薦一件法式風格的碎花裙。",
  "我需要一件工裝風格的多口袋外套。"
];

const searchQueriesRand = [
  "找一件舒適的針織毛衣，適合秋冬穿搭。",
  "推薦一件高腰設計的短裙，適合夏天穿。",
  "我需要一件有蕾絲細節的白襯衫，優雅又大方。",
  "今天想去爬山，請推薦一件適合戶外活動的運動外套。",
  "我有一場重要的面試，推薦一件合適的西裝褲給我。",
  "我需要一件韓系風格的寬鬆T恤。",
  "推薦一件輕奢風格的真絲襯衫。",
]

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [labelString, setLabelString] = useState<string>('');
  const [query, setQuery] = useState<string>("");
  const [gender, setGender] = useState<Gender>('neutral');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState<Series[]>([]);
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(""); // 顏色
  const [selectedVersion, setSelectedVersion] = useState<string>(""); // 版型
  const [selectedStyle, setSelectedStyle] = useState<string>(""); // 風格
  const [selectedType, setSelectedType] = useState<string>(""); // 款式
  const [priceLowerBound, setPriceLowerBound] = useState<number | null>(null);
  const [priceUpperBound, setPriceUpperBound] = useState<number | null>(null);
  const [provider, setProvider] = useState<string[] | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);

  const priceOptions = [300, 500, 750, 1000, 2000, 5000];
  const providerList = [
    { value: "UNIQLO", label: "UNIQLO"},
    { value: "FIFTY PERCENT", label: "FIFTY PERCENT"},
    { value: "H&M", label: "H&M"},
    { value: "GU", label: "GU"},
    { value: "ZARA", label: "ZARA"},
    { value: "lativ", label: "lativ"},
    { value: "PAZZO", label: "PAZZO"},
    { value: "Meier.Q", label: "Meier.Q"},
    { value: "EDWIN", label: "EDWIN"},
  ];

  const handleLowerBoundChange = (value: string) => {
    const numValue = value === "null" ? null : Number(value);
    setPriceLowerBound(numValue);
    if (numValue !== null && priceUpperBound !== null && numValue >= priceUpperBound) {
      setPriceUpperBound(null); // 清空不符合條件的最高價格
    }
  };

  const handleUpperBoundChange = (value: string) => {
    const numValue = value === "null" ? null : Number(value);
    setPriceUpperBound(numValue);
    if (numValue !== null && priceLowerBound !== null && numValue <= priceLowerBound) {
      setPriceLowerBound(null); // 清空不符合條件的最低價格
    }
  };

  const handleBrandChange = (brand: string) => {
    setProvider((prev) => {
      const current = prev ?? [];
      return current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
    });
  };

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user: userResponse },
      } = await supabase.auth.getUser();
      setUserId(userResponse?.id as string);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (searchParams.get('label_string') && searchParams.get('gender') && searchParams.get('title')) {
        setLoading(true);
        setQuery(searchParams.get('title') as string + '的類似單品');
        setLabelString(searchParams.get('label_string') as string);
        setGender(searchParams.get('gender') as string);
        const supabase = createClient();
        const {
          data: { user: userResponse },
        } = await supabase.auth.getUser();
        setUserId(userResponse?.id as string);
        const res = await handleSearch(searchParams.get('label_string') as string, searchParams.get('gender'), page, userId as string, priceLowerBound?priceLowerBound:undefined, priceUpperBound?priceUpperBound:undefined, provider?provider:undefined, undefined); // , userResponse?.id ??
        setResults([...(res?.series as Series[])] as Series[]);
        setTotalPages(res?.totalPages as number);
        setPage(1);
        setLoading(false);
        router.push('/search')
      }
    })();
  }, [searchParams]);

  function getRandomItem(array: string[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  useEffect(() => {
    const randomDescription = getRandomItem(searchQueriesDescription);
    const randomSituation = getRandomItem(searchQueriesSituation);
    const randomType = getRandomItem(searchQueriesType);
    const randomRand = getRandomItem(searchQueriesRand);

    setPromptSuggestions([randomDescription, randomSituation, randomType, randomRand]);
  }, []);

  const handleSuggestionClick = async (suggestion: string) => {
    setSearchInput(suggestion);
    /* TODO: add gender input */
  };

  const onSubmit = async () => {
    if (!searchInput) return;
    setLoading(true);
    const labelForTextSearch = await getLabelStringForTextSearch(gender, "gpt-4o-mini",searchInput);
    setLabelString(labelForTextSearch.labelString);
    const res = await handleSearch(labelForTextSearch.labelString, gender, page, userId as string, priceLowerBound?priceLowerBound:undefined, priceUpperBound?priceUpperBound:undefined, provider?provider:undefined, undefined);
    setResults([...(res?.series as Series[])] as Series[]);
    setTotalPages(res?.totalPages as number);
    setPage(1);
    setQuery(searchInput);
    setSearchInput("");
    // console.log(res?.series);
    setLoading(false);
  };

  const handlePageNavigation = async (page: number) => {
    setPage(page);
    setLoading(true);
    console.log(labelString)
    const res = await handleSearch(labelString, gender, page, userId as string, priceLowerBound?priceLowerBound:undefined, priceUpperBound?priceUpperBound:undefined, provider?provider:undefined, undefined);
    console.log(res);
    setResults([...(res?.series as Series[])] as Series[]);
    setLoading(false);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex w-full gap-2'>
          <div className='relative mb-4 w-full'>
            <Input
              id='search-bar'
              type='search'
              placeholder='你今天想找什麼樣的服飾呢？'
              className='w-full pl-10 pr-6'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          </div>

          <Button
            id='prompt-constructor-button'
            size='icon'
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn('mb-2 text-gray-700 hover:bg-gray-200 p-1', isExpanded ? 'bg-gray-200' : 'bg-transparnet')}
          >
            <SlidersHorizontal className="w-5" />
          </Button>
          
          <LoadingButton
            className='bg-indigo-400 hover:bg-indigo-300'
            onClick={onSubmit}
            loading={loading}
          >
            {!loading && <SearchIcon />}
          </LoadingButton>
        </div>

        <div className="bg-gray-100 p-2 mb-4 rounded-md">
          <div className="flex gap-2 items-center justify-begin">
            <Select onValueChange={(value: Gender) => {
              setGender(value);
              console.log(value);
            }}>
              <SelectTrigger className="w-[100px] bg-white">
                <SelectValue id='gender-select' placeholder="性別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">無限制</SelectItem>
                <SelectItem value="male">男性</SelectItem>
                <SelectItem value="female">女性</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Select
                value={priceLowerBound !== null ? priceLowerBound.toString() : "null"}
                onValueChange={(value) => handleLowerBoundChange(value)}
              >
                <SelectTrigger className="w-[120px] bg-white">
                  <SelectValue placeholder="價格下限" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">價格下限</SelectItem> {/* 清空選項 */}
                  {priceOptions.map((price) => (
                    <SelectItem
                      key={price}
                      value={price.toString()}
                      disabled={priceUpperBound !== null && price >= priceUpperBound} // 禁用不符合條件的選項
                    >
                      ${price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 最高價格篩選器 */}
            <div className="flex items-center gap-2">
              <Select
                value={priceUpperBound !== null ? priceUpperBound.toString() : "null"}
                onValueChange={(value) => handleUpperBoundChange(value)}
              >
                <SelectTrigger className="w-[120px] bg-white">
                  <SelectValue placeholder="價格上限" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">價格上限</SelectItem> {/* 清空選項 */}
                  {priceOptions.map((price) => (
                    <SelectItem
                      key={price}
                      value={price.toString()}
                      disabled={priceLowerBound !== null && price <= priceLowerBound} // 禁用不符合條件的選項
                    >
                      ${price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* provider */}
            <MultiSelect
              options={providerList}
              onValueChange={(selected) => setProvider(selected.length > 0 ? selected : null)}
              defaultValue={provider ?? []} // If provider is null, pass an empty array
              placeholder="選擇品牌"
              variant="inverted"
              animation={2}
              maxCount={3} // Allow selection of all options
            />
          </div>
        </div>

        {isExpanded && (
          <div className="bg-gray-100 px-2 mb-4 rounded-md">
            <div className="text-indigo-400 text-center px-3 font-semibold mb-2">
              快速填寫
            </div>

            <div className="flex flex-col gap-4">
  {/* 顏色 */}
  <div className="flex flex-wrap gap-2 justify-center">
    {[
      { label: "黑色", value: "黑色" },
      { label: "白色", value: "白色" },
      { label: "灰色", value: "灰色" },
      { label: "紅色", value: "紅色" },
      { label: "橘色", value: "橘色" },
      { label: "黃色", value: "黃色" },
      { label: "綠色", value: "綠色" },
      { label: "藍色", value: "藍色" },
      { label: "紫色", value: "紫色" },
      { label: "粉色", value: "粉色" },
      { label: "棕色", value: "棕色" },
    ].map((item) => (
      <button
        key={item.value}
        onClick={() => {
          if (!searchInput.includes(item.value)) {
            setSearchInput((prev) => (prev + " " + item.value).trim());
          }
        }}
        className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md shadow-sm text-sm font-medium"
      >
        {item.label}
      </button>
    ))}
  </div>

  {/* 版型 */}
  <div className="flex flex-wrap gap-2 justify-center">
    {[
      { label: "短袖", value: "短袖" },
      { label: "長袖", value: "長袖" },
      { label: "短褲", value: "短褲" },
      { label: "長褲", value: "長褲" },
      { label: "短裙", value: "短裙" },
      { label: "長裙", value: "長裙" },
      { label: "T恤", value: "T恤" },
      { label: "帽T", value: "帽T" },
      { label: "襯衫", value: "襯衫" },
      { label: "針織衫", value: "針織衫" },
      { label: "毛衣", value: "毛衣" },
      { label: "牛仔", value: "牛仔" },
    ].map((item) => (
      <button
        key={item.value}
        onClick={() => {
          if (!searchInput.includes(item.value)) {
            setSearchInput((prev) => (prev + " " + item.value).trim());
          }
        }}
        className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md shadow-sm text-sm font-medium"
      >
        {item.label}
      </button>
    ))}
  </div>

  {/* 風格 */}
  <div className="flex flex-wrap gap-2 justify-center">
    {[
      { label: "極簡", value: "極簡" },
      { label: "街頭", value: "街頭" },
      { label: "復古", value: "復古" },
      { label: "工裝", value: "工裝" },
      { label: "優雅", value: "優雅" },
      { label: "日系", value: "日系" },
      { label: "韓系", value: "韓系" },
      { label: "美式", value: "美式" },
      { label: "法式", value: "法式" },
    ].map((item) => (
      <button
        key={item.value}
        onClick={() => {
          if (!searchInput.includes(item.value)) {
            setSearchInput((prev) => (prev + " " + item.value).trim());
          }
        }}
        className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md shadow-sm text-sm font-medium"
      >
        {item.label}
      </button>
    ))}
  </div>
</div>

          </div>
        )}


        <div id='prompt-suggestions' className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          {promptSuggestions.map((suggestion, index) => (
            <Card
              key={index}
              className='bg-indigo-200/50 cursor-pointer hover:bg-indigo-200/20 transition-colors shadow-[2px_2px_0px_0px_rgba(99,102,241,0.7)] border-2 border-indigo-500/70'
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <CardContent className='p-4 h-full flex items-center justify-center text-center'>
                <p className='text-sm font-semibold'>「{suggestion}」</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {
          results.length === 0 &&
            <div className="w-full flex items-end justify-end my-4">
              <TourButton tourName='search' />
            </div>
        }
      </div>
      {loading ? (
        <ItemListSkeleton index={0} />
      ) : (
        <ItemList
          title=''
          description={query}
          series={results}
          id={0}
          index={0}
          expandOnMount={true}
          expandable={false}
        />
      )}
      {
        results.length > 0 &&
        <div className="mt-8 w-full flex items-center justify-center">
          <PaginationBar
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageNavigation}
          />
        </div>
      }
    </div>
  );
}
