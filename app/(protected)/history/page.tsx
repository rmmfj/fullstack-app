import { getPreviewsByUserId } from "@/actions/utils/user";
import PreviewList from "@/components/preview-list";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const HistoryPage = async () => {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const previews = await getPreviewsByUserId(user?.id as string);
  return <div className='container mx-auto px-4 py-8'>
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex w-[20rem] items-center justify-center bg-gray-200 rounded-md py-2 px-0">
        <div className="px-10 rounded-sm py-1 cursor-pointer">
          <Link href='/upload'>
            新的推薦
          </Link>
        </div>
        <div className="px-10 rounded-sm bg-gray-100 py-1">歷史紀錄</div>
      </div>
      <PreviewList
        title='穿搭推薦'
        previews={previews}
        description='您過去上傳的推薦照片都會顯示在此，點擊圖片查看推薦結果'
      />
    </div>
  </div>;
}

export default HistoryPage;