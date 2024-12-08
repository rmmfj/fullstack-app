"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "../ui/card";

{
  /* TODO: Produce content for testimonial */
}

const TESTIMONIALS = [
  {
    name: "Eva",
    content: "終於可以輕鬆找到路人穿的衣服了！以服搜服真的太神了！",
    avatarUrl: "/image/avatar.jpeg",
  },
  {
    name: "Kevin",
    content: "我喜歡直接打出我想要的風格，不需要糾結用詞，系統懂我！",
    avatarUrl: "/image/avatar.jpeg",
  },
  {
    name: "Lily",
    content: "幫我找到很多獨特的品牌，每次穿出去都能引起話題！",
    avatarUrl: "/image/avatar.jpeg",
  },
  {
    name: "Cindy",
    content: "拍照就能找同款，再也不怕錯過心動穿搭！",
    avatarUrl: "/image/avatar.jpeg",
  },
  {
    name: "Morris",
    content: "多品牌整合真方便，買衣服不用再切來切去！",
    avatarUrl: "/image/avatar.jpeg",
  },
];

const TestimonialSection = () => {
  return (
    <section id='testimonial' className='py-20 w-full bg-gray-50'>
      <div className='max-w-[85vw] container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>用戶真心推薦</h2>
        <p className='text-gray-600 text-center mb-12'>
          我們的用戶都超愛這個簡單又精準的穿搭神器！
          <br />
          不管是以服搜服還是穿搭推薦，他們都發現了自己的時尚新可能。
          <br />
          聽聽他們怎麼說，感受他們的喜悅，說不定下一個穿搭達人就是你！
        </p>
        <div className='w-full flex flex-wrap gap-8 items-center justify-center'>
          {TESTIMONIALS.map((testimonial, index) => (
            <Card
              key={index}
              className='opacity-95 backdrop-blur-md bg-gray-50 w-[19rem] h-fit flex items-center gap-4 p-6 rounded-l-none rounded-r-sm border-0 border-l-4 border-solide border-indigo-400 shadow-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'
            >
              <Avatar className='h-10 w-10'>
                <AvatarImage
                  src={
                    (testimonial.avatarUrl as string) ||
                    "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/OIP.jpeg"
                  }
                  alt={`${testimonial.name}'s Avatar`}
                />
                <AvatarFallback>{testimonial.name}</AvatarFallback>
              </Avatar>
              <div className='text-sm'>
                <h3 className='font-semibold'>{testimonial.name}</h3>
                <p className='text-gray-600'>{testimonial.content}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
