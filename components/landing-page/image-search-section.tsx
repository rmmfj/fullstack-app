"use client";

import { useState } from "react";
import Section from "./section";

// 假資料（可以用 API 替換）
const images = [
  {
    id: 1,
    src: "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-9962ccbb-155c-41a3-a625-83939201fa3c",
    similar: [
      "https://static.zara.net/assets/public/6841/875c/210d48d58353/cb441b23a6b8/09794311400-p/09794311400-p.jpg?ts=1730637856774&w=343",
      "https://s3.hicloud.net.tw/fifty/new_women/02489351002/41-2.jpg",
      "https://pics.pzcdn.tw/pazzo/ProductCovers/19540ed0-f428-4bbb-a8dc-1fcbfdee07ab_w198_h252.jpg",
      "https://www.uniqlo.com/tw/hmall/test/u0000000018444/sku/561/COL64.jpg",
      "https://s3.hicloud.net.tw/fifty/new_women/02289251006/41-2.jpg"

    ],
  },
  {
    id: 2,
    src: "https://clothing.rfjmm.com/image/22212ed5-6e0c-4235-b263-2b657bba9d8e",
    similar: [
      "https://static.zara.net/assets/public/4a85/f081/ddc943c6aad2/36e83943ee27/05926531403-p/05926531403-p.jpg?ts=1730643819995&w=343",
      "https://static.zara.net/assets/public/5548/116b/46e24896a6d2/aafd12323bd9/05570811104-p/05570811104-p.jpg?ts=1717512575484&w=343",
      "https://static.zara.net/assets/public/b120/38e0/71dd4ceab815/e738b216dea2/00975845400-p/00975845400-p.jpg?ts=1730642123271&w=343",
      "https://static.zara.net/assets/public/3b1b/f8be/6f5548dfa37f/3893e067ac35/05700243105-a1/05700243105-a1.jpg?ts=1730630292969&w=343",
      "https://static.zara.net/assets/public/9dbd/04c2/2ce94b8fb618/877e5be7ac0f/05588512105-p/05588512105-p.jpg?ts=1719911229847&w=400"
    ],
  },
  {
    id: 3,
    src: 
    "https://clothing.rfjmm.com/image/00c4749b-26fa-4881-b4c5-4cad82d9f804",
    similar: [
      "https://static.zara.net/assets/public/94f6/e1ed/d8c04a198092/3d28b8ee632e/09794310500-p/09794310500-p.jpg?ts=1730365035483&w=343",
      "https://www.uniqlo.com/tw/hmall/test/u0000000050065/sku/561/COL58.jpg",
      "https://www.uniqlo.com/tw/hmall/test/u0000000020382/sku/561/COL55.jpg",
      "https://www.uniqlo.com/tw/hmall/test/u0000000019687/sku/561/COL56.jpg",
      "https://www.uniqlo.com/tw/hmall/test/u0000000019632/sku/561/COL57.jpg"
    ],
  },
];

const ImageSearchSection = () => {
  const [selectedImage, setSelectedImage] = useState<string[] | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  const handleImageClick = (similarImages: string[], imageId: number) => {
    setSelectedImage(similarImages);
    setSelectedImageId(imageId);
  };

  return (
    <Section
      id="image-search-feature"
      title="📸 以服搜服"
      // slogan="上傳圖片，精準搜出相似風格！"
      slogan='隨拍隨搜，輕鬆找到同款！'
      description={
        // `上傳任意衣物圖片，我們將即時搜尋同款或相似風格的單品，
        // 讓您輕鬆找到滿意的結果。小視窗讓您即刻試用並體驗這項功能的效果！`
        `在路上看到心儀的服飾，卻不知道哪裡買？
        別擔心，拿起手機隨拍隨搜，AI 會立刻幫你找到相似款，
        告訴你在哪裡購買，省時又省力！
        即使是街頭看到的時尚，也能輕鬆擁有！`
      }
      buttonText="探索相似款式！"
      buttonLink="/image-search"
      reverse={false}
      darkerBackground={false}
    >
      <div className="flex flex-col md:flex-row gap-4 ml-3">
        {/* 左側圖片列表 */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 py-6">
          <div className="flex flex-col gap-3 items-center">
            {images.map((image) => (
              <img
                key={image.id}
                src={image.src}
                alt={`Item ${image.id}`}
                className={`cursor-pointer w-24 h-24 object-cover border border-gray-300 rounded-lg hover:shadow-lg ${
                  selectedImageId === image.id ? "border-indigo-500" : ""
                }`}
                // className="cursor-pointer w-24 h-24 object-cover border border-gray-300 rounded-lg hover:shadow-lg"
                onClick={() => handleImageClick(image.similar, image.id)}
              />
            ))}
          </div>
        </div>

        {/* 右側相似圖片 */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-center border-b-2 border-indigo-500 pb-2">搜尋結果</h3>
          {selectedImage ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedImage.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Similar ${index + 1}`}
                  className="w-32 h-32 object-cover border border-gray-300 rounded-lg hover:shadow-lg"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">選擇左側的圖片以查看相似圖片。</p>
          )}
        </div>
      </div>
    </Section>
  );
};

export default ImageSearchSection;
