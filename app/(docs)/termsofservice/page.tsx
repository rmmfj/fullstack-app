"use client";

import { useRouter } from "next/navigation";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* 隱私權政策內容 */}
      <h1 className="text-2xl font-bold mb-4 text-center">服務條款</h1>
      <p>
        <strong>服務條款：一鍵穿新</strong>
      </p>
      <div className="text-gray-600">
        <p>1. 資料收集</p>
        <p>我們僅收集必要的資訊，包括姓名、頭像及電子郵件地址。</p>
        <p>2. 資料用途</p>
        <p>
          資料將用於顯示您的身分、提供個性化用戶體驗等功能。
        </p>
        <p>3. 資料共享與外洩</p>
        <p>我們承諾不會將您的資料外洩或分享給任何第三方。</p>
        <p>4. 用戶權利</p>
        <p>您有權隨時查詢、更新或要求刪除您的個人資料。如需協助，請透過聯絡頁面與我們聯繫。</p>
        <p>5. 資料保護</p>
        <p>我們採用先進的安全技術來保護您的資料，防止未經授權的訪問或使用。</p>
        <p>6. 政策更新</p>
        <p>如有重大更改，我們將通過電子郵件或網站公告通知您。</p>

        <p>更多資訊，請參考《隱私權政策》。</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;