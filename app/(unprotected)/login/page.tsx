'use client'

import { getProfileByUserId } from '@/actions/utils/user';
import GoogleLoginButton from "@/components/google-login-button";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { toast } = useToast()
  useEffect(() => { 
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const profile = await getProfileByUserId(user?.id as string);
        toast({
          title: `嗨嗨，${profile.username}，歡迎回來啦！👋✨`,
          description: `好久不見～讓我們一起變潮吧！🎉👗👖`,
        })
        redirect('/home');
      }
    })()
  }, []);
  return (
    <div className="flex-1 flex items-center flex-col w-full px-8 sm:max-w-md justify-center gap-6 pt-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-xl font-bold text-gray-700">
          加入我們，解鎖你的穿搭新世界！
        </h2>
        <p className="text-gray-600">
          註冊帳號即可解鎖保留推薦紀錄與收藏商品功能，隨時回顧穿搭靈感，讓你的時尚旅程更加方便！
        </p>
      </div>
      <div className="w-full flex flex-col gap-1">
        <GoogleLoginButton />
          <Button asChild variant='outline' className="w-full bg-indigo-400 hover:bg-indigo-300 text-white hover:text-white">
            <Link href="home">
              以訪客身份繼續
            </Link>
          </Button>
      </div>
      <div className="text-sm text-gray-500 relative flex gap-2 flex-col items-center justify-center">
        <p>
          繼續操作即表示您同意我們的
        </p>
        <div className="flex justify-center space-x-6 text-sm mb-4">
          <Link href="/termsofservice" className="underline">
            服務條款
          </Link>
          <Link href="/privacypolicy" className="underline">
            隱私權政策
          </Link>
        </div>
      </div>
    </div>
  );
}
