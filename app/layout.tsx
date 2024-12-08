import TourCard from '@/components/tour-card';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { Inter as FontSans } from "next/font/google";

import Header from "@/components/header";
import { cn } from "@/lib/utils";

import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import Image from 'next/image';
import { Onborda, OnbordaProvider, Step } from "onborda";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const defaultUrl =
  process.env.NODE_ENV === "production"
    ? "https://clothing.rfjmm.com"
    : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Clothing Recommendation",
  description: "一鍵穿新",
};

const RECOMMENDATION_STEPS: Step[] = [
  // Example steps
  {
    icon: <></>,
    title: "上傳照片",
    content: <div className='flex flex-col gap-4'>
      <p>
        上傳你想要搭配的上衣或下身單品
      </p>
      <Image
        src={'https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/Untitled%20design.png'}
        style={{objectFit:"cover"}}
        width={256}
        height={256}
        alt='Example upload image'
      />
      * 照片不可裁切到服飾過多細節，也請確保照明充足
    </div>,
    selector: "#image-uploader",
    side: "right",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
    nextRoute: '/upload?step=2'
  },
  {
    icon: <></>,
    title: "選擇參數",
    content: <>勾選你的需求</>,
    selector: "#form-fields",
    side: "right",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
    prevRoute: '/upload?step=1',
    nextRoute: '/upload?step=3'
  },
  {
    icon: <></>,
    title: "確認上傳",
    content: <>確認無誤就可以進行推薦啦！</>,
    selector: "#overview",
    side: "right",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
    prevRoute: '/upload?step=2',
    nextRoute: '/upload?step=1'
  },
  {
    icon: <></>,
    title: "歷史紀錄",
    content: <>還可以查看之前的推薦結果唷～</>,
    selector: "#recommendation-tabs-list",
    side: "bottom",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
    prevRoute: '/upload?step=3',
  },
];

const SEARCH_STEPS: Step[] = [
  {
    icon: <></>,
    title: "白話搜尋",
    content: <>
      不知道怎麼提取關鍵字嗎？沒關係！
      <br />
      在這裡想說什麼就說什麼，白話一樣行！
    </>,
    selector: "#search-bar",
    side: "bottom",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
  },
  {
    icon: <></>,
    title: "篩選與快捷輸入",
    content: <>
      展開快捷輸入工具，四種形容詞及數十種選項供你搭配嘗試！
      此外，搜尋前可以設定服飾性別進行篩選。
    </>,
    selector: "#prompt-constructor-button",
    side: "bottom",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
  },
  {
    icon: <></>,
    title: "隨機輸入",
    content: <>
      試試隨機的搜尋輸入，說不定能激發靈感唷！
    </>,
    selector: "#prompt-suggestions",
    side: "bottom",
    showControls: true,
    pointerPadding: 24,
    pointerRadius: 12,
  },
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={GeistSans.className}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground",
          fontSans.variable
        )}
      >
        <Header />
        <OnbordaProvider>
          <Onborda
            steps={[{ 'tour': 'recommendation', 'steps': RECOMMENDATION_STEPS }, { 'tour': 'search', 'steps': SEARCH_STEPS }]}
            showOnborda={true}
            shadowOpacity="0.7"
            cardComponent={TourCard}
          >
            <div className='flex-1 flex justify-center min-h-[93vh] items-center overflow-y-scroll overflow-x-hiddena'>
              {children}
            </div>
          </Onborda>
        </OnbordaProvider>
        <Footer />
        <Toaster />
      </body>
      <GoogleAnalytics gaId="G-79W179FVTX" />
    </html>
  );
}
