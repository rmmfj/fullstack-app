"use client";

import { useRouter } from "next/navigation";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* 返回按鈕 */}
      <button
        className="text-indigo-500 hover:underline mb-4"
        onClick={() => router.push("/")}
      >
        返回
      </button>

      {/* 隱私權政策內容 */}
      <h1 className="text-2xl font-bold mb-4">隱私權政策</h1>
      <p><strong>一鍵穿新隱私權政策</strong></p>
      <p>最後更新日期：2024年11月28日</p>
      <p>
        本隱私權政策說明了我們在您使用本服務時，對您的個人資料的收集、使用及揭露的政策與程序，並告知您有關您的隱私權及法律如何保護您。
      </p>
      <p>
        我們使用您的個人資料以提供並改善本服務。透過使用本服務，即表示您同意根據本隱私權政策收集和使用資訊。
      </p>
      <hr className="my-4" />
      <h2 className="font-bold text-lg">解釋與定義</h2>
      <h3 className="font-bold">解釋</h3>
            <p>
              首字母大寫的詞語在以下條件下具有定義的含義。無論這些詞語以單數或複數形式出現，其定義均相同。
            </p>
            <h3 className="font-bold">定義</h3>
            <ul className="list-disc pl-6">
              <li><strong>帳戶：</strong>指為您創建以訪問本服務或其部分內容的唯一帳戶。</li>
              <li><strong>關係企業：</strong>指控制、受控制或與一方處於共同控制下的實體，其中“控制”指擁有50％或以上的股份、股權或有表決權的其他證券。</li>
              <li><strong>公司：</strong>指「一鍵穿新」。</li>
              <li><strong>Cookies：</strong>指由網站放置在您的電腦、行動裝置或其他設備上的小型檔案，用於記錄您的瀏覽歷史等資訊。</li>
              <li><strong>國家：</strong>指臺灣。</li>
              <li><strong>設備：</strong>指任何可以訪問本服務的裝置，例如電腦、手機或平板電腦。</li>
              <li><strong>個人資料：</strong>指與已識別或可識別的個人相關的任何資訊。</li>
              <li><strong>服務：</strong>指網站。</li>
              <li><strong>服務提供者：</strong>指代表公司處理資料的自然人或法人，包括第三方公司或個人，他們協助公司提供服務、執行服務相關工作或分析服務的使用情況。</li>
              <li><strong>使用數據：</strong>指透過使用服務或服務基礎結構本身自動收集的數據，例如頁面訪問時間的長度等。</li>
              <li><strong>您：</strong>指訪問或使用本服務的個人，或代表該個人訪問或使用本服務的公司或其他法律實體（如適用）。</li>
            </ul>
            <hr />
            <h2 className="font-bold text-lg">收集及使用您的個人資料</h2>
            <h3 className="font-bold">收集的資料類型</h3>
            <h4 className="font-bold">個人資料</h4>
            <p>
              在使用我們的服務時，我們可能會要求您提供某些可識別身份的資訊，以便與您聯絡或識別您的身份。可識別身份的資訊可能包括但不限於：
            </p>
            <ul className="list-disc pl-6">
              <li>電子郵件地址</li>
              <li>姓名</li>
              <li>使用數據</li>
            </ul>
            <h4 className="font-bold">使用數據</h4>
            <p>
            使用數據會在您使用服務時自動收集。

使用數據可能包括：您的設備的網際網路協定位址（如IP地址）、瀏覽器類型、瀏覽器版本、您訪問本服務的頁面、訪問的日期與時間、在這些頁面上花費的時間、唯一設備識別碼和其他診斷數據。

當您透過行動裝置訪問服務時，我們可能會自動收集某些資訊，包括但不限於您使用的行動裝置類型、唯一設備ID、行動裝置的IP地址、行動作業系統、行動網路瀏覽器的類型以及其他診斷數據。

我們也可能收集您瀏覽我們服務時或透過行動裝置訪問服務時，您的瀏覽器發送的資訊。
            </p>
            <hr />
            <h2 className="font-bold text-lg">追蹤技術與Cookies</h2>
            <p>
            我們使用Cookies和類似的追蹤技術來追蹤服務活動並存儲某些資訊。追蹤技術包括信標、標籤和腳本，用於收集和追蹤資訊，以及改進和分析服務。
            </p>
            <p>
            您可選擇拒絕所有Cookies或在Cookies被發送時進行提示，但拒絕Cookies可能會影響部分服務功能。
            </p>
            <hr />
            <h2 className="font-bold text-lg">使用您的個人資料</h2>
            <ol className="list-decimal pl-6">
              <li>提供及維護服務：包括監測服務的使用情況。</li>
              <li>管理您的帳戶：管理您的用戶註冊並提供訪問服務的相關功能。
              </li>
              <li>履行契約：包括購買協議的履行及其他與您簽訂的協議。</li>
              <li>聯繫您：透過電子郵件、推送通知或其他電子方式聯繫您，提供功能更新、產品資訊及安全更新等。</li>
              <li>提供資訊：為您提供與您已購買或查詢的產品或服務相似的其他商品、服務或活動的一般資訊，除非您選擇退出。</li>
            </ol>
            <hr />
            <h2 className="font-bold text-lg">保留及刪除您的個人資料</h2>
            <p>
            公司僅會在實現本隱私政策所述目的所需的期限內保留您的個人資料。我們可能因法定義務需要保留某些資料，或用於解決爭議及執行協議。
            </p>
            <hr />
            <h2 className="font-bold text-lg">聯絡方式</h2>
            <p>
            如有任何隱私政策相關問題，您可以透過以下電子郵件聯繫我們：
            </p>
            <p>
              <a href="mailto:mmrfj@ntu.im" className="text-blue-500 hover:underline">
                mmrfj@ntu.im
              </a>
            </p>
    </div>
  );
};

export default PrivacyPolicy;