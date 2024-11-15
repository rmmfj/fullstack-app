"use client";

import Section from "./section";

const ImageSearchSection = () => {
  return (
    <Section
      id='image-search-feature'
      title='以服搜服'
      slogan='上傳圖片，精準搜出相似風格！'
      description={
        `上傳任意衣物圖片，我們將即時搜尋同款或相似風格的單品，
        讓您輕鬆找到滿意的結果。右側的小視窗讓您即刻試用並體驗這項功能效的果！`
      }
      buttonText="探索相似款式！"
      buttonLink="/search"
      reverse={false}
      darkerBackground={false}
    >
      內容待生成
    </Section>
  );
};

export default ImageSearchSection;
