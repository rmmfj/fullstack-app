'use client';

import Link from 'next/link';

import { ArrowRight, ScanSearch, Shirt, TextSearch } from 'lucide-react';

const FEATURES = [
  {
    title: '穿搭推薦',
    icon: <Shirt className="w-4 h-4" />,
    desrciption: '上傳服飾照片，找到最適服飾單品。輕鬆解決每天出門前的穿衣煩惱～',
    href: '/upload',
    buttonText: '感受專屬的穿搭推薦',
  },
  {
    title: '文字搜尋',
    icon: <TextSearch className="w-4 h-4" />,
    desrciption: '輸入需求，快速篩選最符合的商品。不用花時間檢索，系統懂你在說啥！',
    href: '/search',
    buttonText: '探索相似款式',
  },
  {
    title: '以服搜服',
    icon: <ScanSearch className="w-4 h-4" />,
    desrciption: '上傳服飾照片，搜尋相似的商品。看到喜歡的穿搭，隨時都能找到購買方式。',
    href: '/image-search',
    buttonText: '快速找到理想的單品',
  }
]


export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <main className="max-w-6xl mx-auto p-6 pt-12 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-200 to-indigo-400 text-white py-8 px-12 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-2">最新公告</h2>
          <p>
            大家注意啦！我們的平台自上線以來，造訪次數已經突破
            <strong>
              100
            </strong>
            次啦！🎉
            <br />
            這一切都要感謝各位使用者的支持與參與🙏
            <br />
            未來我們會持續開發更多好玩的功能，敬請期待！
            <br />
            非常鼓勵大家透過粉專給我們回饋，有什麼建議或意見，我們都會認真對待，每一則回饋都是我們前進的動力✨
          </p>
        </div>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <div key={index} className="bg-white overflow-hidden rounded-lg">
                <div className="p-5 text-gray-800">
                  <div className='flex items-center justify-start gap-2'>
                    {feature.icon}
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.desrciption}
                  </p>
                </div>
                <div className="px-5 py-3">
                  <Link 
                    href={feature.href}
                    className="text-sm underline font-medium text-indigo-500 hover:text-indigo-400 flex items-center justify-end"
                  >
                    { feature.buttonText }
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
