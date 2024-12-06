"use client";

import { useState } from "react";
import Section from "./section";
import { SearchIcon } from "lucide-react";

const imageResult1 = 
  ["https://s3.hicloud.net.tw/fifty/new_men/02459151002/23-2.jpg",
    "https://www.gu-global.com/tw/hmall/test/u0000000010161/sku//561/GCL34.jpg",
    "https://www.gu-global.com/tw/hmall/test/u0000000010362/sku//561/GCL36.jpg"
  ]

const TextSearchSection: React.FC = () => {
  // Define state with TypeScript types
  const [searchText, setSearchText] = useState<string>("");
  const [imageResult, setImageResult] = useState<string[] | null>(null);

  // Sample suggestions
  const suggestions: string[] = ["黑色西裝褲", "休閒牛仔裙", "卡其色的極簡T恤"];

  // Handle the search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // Fill input with suggestion text
  const handleSuggestionClick = (text: string) => {
    setSearchText(text);
  };

  // Mock search function
  const handleSearch = () => {
    if(searchText == "黑色西裝褲"){
      setImageResult(
        ["https://net.wimg.tw/files/1/products/525290_400_900E9BB91E889B2.jpg?v=30129",
        "https://pics.meierq.com/meierq/ProductBasics/863793cf-6a0b-4c4f-a201-660397352b20_w198_h252.jpg",
        "https://pics.pzcdn.tw/pazzo/ProductCovers/ce5b0686-09c3-48b0-9603-3ca2b670de86_w198_h252.jpg"
      ]); // Replace with dynamic image URL or state.
    }else if(searchText == "休閒牛仔裙"){
      setImageResult(
        ["https://lp2.hm.com/hmgoepprod?set=source[/ef/bd/efbd6061915f17d9e005c2a32eabb1a4c4527834.jpg],origin[dam],category[Ladies_skirts_denim],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://static.zara.net/assets/public/dc7e/ce8b/b3164778ae4e/ba7f16849feb/09632270400-p/09632270400-p.jpg?ts=1730636064771&w=343",
        "https://pics.pzcdn.tw/pazzo/ProductCovers/8c5eddb3-7633-4742-a6b3-8d31eba786a5_w198_h252.jpg"
      ]); // Replace with dynamic image URL or state.
    }else{
      setImageResult(
        ["https://lp2.hm.com/hmgoepprod?set=source[/54/8d/548dcb2c9d47536b6f95d8afd0b4883bae0bb1dc.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/1d/1b/1d1b47a99ccf900c7a7d6bf56aaaaaf092407148.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://s.lativ.com.tw/i/64262/64262021/6426202_500.jpg"
      ]); // Replace with dynamic image URL or state.
    }
    // This is a placeholder. Replace with actual image fetching logic.
    
  };

  return (
    <Section
      id='text-search-feature'
      title='文字搜尋'
      slogan='簡單一句話，尋找理想單品！'
      description={
        `輸入一句簡單的搜尋詞，如衣物的細節、搭配的情境等，
        系統會根據您的描述推薦合適的單品，讓搜尋更加符合您的需求。
        邀請您在搜尋區塊進行試用，探索這項便捷的搜尋體驗！`
      }
      buttonText="快速找到理想的單品！"
      buttonLink="/search"
      reverse={true}
      darkerBackground={true}
    >
      {/* Search Input and Button */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchText}
            disabled={true}
            onChange={handleInputChange}
            placeholder="你今天想找什麼樣的服飾呢？"
            className="w-64 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-400 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
          >
            <SearchIcon />
          </button>
        </div>

        {/* Suggestion Buttons */}
        <div className="flex gap-2 mt-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg border border-indigo-300 hover:bg-indigo-200"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Search Result Image */}
        {imageResult && (
          <div className="mt-6 flex space-x-4">
            {imageResult.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`搜索結果 ${index + 1}`}
                  className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};

export default TextSearchSection;
