"use client";

import { Instagram } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  // 判斷路徑是否為首頁，非首頁不顯示 Footer
  if (pathname !== "/") return <></>;

  return (
    <footer className="bg-indigo-400 flex flex-col w-full border-t border-t-foreground/10 p-8 justify-center text-center text-xs">
      {/* 社群連結 */}
      <div className="flex justify-center space-x-4 mb-4">
        <Link
          href="https://www.instagram.com/one_click_outfit"
          target='_blank'
          className="text-white hover:text-gray-400"
        >
          <Instagram />
        </Link>
      </div>

      {/* 服務條款和隱私權政策按鈕 */}
      <div className="flex justify-center space-x-6 text-sm mb-4">
        <Link href="/termsofservice" className="text-white hover:underline">
          服務條款
        </Link>
        <Link href="/privacypolicy" className="text-white hover:underline">
          隱私權政策
        </Link>
      </div>

      {/* 版權聲明 */}
      <div className="text-sm text-white">
        © 2024 一鍵穿新 One Click Outfit｜All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
