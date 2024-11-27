import { getFavoriteByUserId } from "@/actions/favorite";
import { getPreviewsByUserId } from "@/actions/utils/user";
import ItemList from "@/components/item/item-list";
import ItemListSkeleton from "@/components/item/item-list-skeleton";
import PreviewList from "@/components/preview-list";
import UnderConstruction from "@/components/under-construction";
import { createClient } from "@/utils/supabase/server";

const ClosetPage = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log(user)
  if (!user) return <></>;
  const favorites = await getFavoriteByUserId(user?.id);
  const previews = await getPreviewsByUserId(user?.id as string);

  return <div className='container mx-auto px-4 py-8'>
      <div className='flex w-full gap-2'>{!favorites ? (
        <ItemListSkeleton index={0} />
      ) : (
        <div className="flex flex-col gap-8">
          <ItemList
            title='我的最愛'
            description={'你收藏的服飾都會被收納在這裡'}
            series={favorites}
            id={0}
            index={0}
            expandOnMount={true}
            expandable={false}
          />
          <PreviewList
            title='穿搭推薦'
            id={""}
            index={0}
            previews={previews}
            description='您過去上傳的推薦照片都會顯示在此，點擊圖片查看推薦結果'
          />
        </div>
      )}</div>
  </div>;
  return <UnderConstruction />;
}

export default ClosetPage;