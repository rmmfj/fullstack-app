import { getFavoriteByUserId } from "@/actions/favorite";
import { getPreviewsByUserId } from "@/actions/utils/user";
import ItemList from "@/components/item/item-list";
import ItemListSkeleton from "@/components/item/item-list-skeleton";
import PreviewList from "@/components/preview-list";
import UnderConstruction from "@/components/under-construction";
import { createClient } from "@/utils/supabase/server";

const FAVORITE_QUOTES = [
  "與你相遇，好幸運。✨",
  "茫茫人海，偏偏遇見了它。💫",
  "有緣千里來收藏。📦",
  "或許這就是註定的緣分。🔗",
  "喜歡是一種奇妙的緣分。❤️",
  "總有些東西，值得被珍藏。🪄",
  "有緣遇見，也許就是為了擁有。🌟",
  "它停留在這裡，等的就是你。🕒",
  "千挑萬選，終於遇見心動的它。💘",
  "這段緣分，讓它成為你的專屬。🎁",
  "一切都是最好的安排。🧡",
  "這是緣分，也是你的選擇。🌈",
  "遇見它，是命運的驚喜。🎉",
  "每個收藏，都是一段故事的開始。📖",
  "它是命中註定的存在。🔮",
  "喜歡不需要理由，遇見就是緣分。🎯",
  "有些美好，值得被永遠記住。🖼️",
  "命運讓你們相遇，選擇讓它屬於你。💞",
  "它的美，剛好是你需要的答案。💡",
  "最美的收藏，就是與你相遇。🌺",
  "也許下一次遇見，就不會再錯過了。⏳",
  "這一刻，你們的緣分正式開始。⛳",
  "每個心動，都是一種獨特的連結。💓",
  "它註定為你而來。🛍️",
  "緣分，總是悄然間發生。🤍",
  "它的存在，是為了被珍視。🌠",
  "喜歡是瞬間的感覺，收藏是永遠的心意。📌",
  "總有些東西，注定要進入你的生活。🌎",
  "遇見它，像遇見一個老朋友。🤝",
  "收藏它，因為它值得。🌼",
  "有些緣分，就是這麼不可思議。✨",
  "或許這就是所謂的天意。🌙",
  "它等待了很久，只為這一刻。🎀",
  "與它相遇，是一種難得的幸運。💎",
  "因為懂得，所以選擇。📖",
  "這段緣分，注定屬於你。💍",
  "每一次收藏，都是一次心靈的契合。🫶",
  "它就是那個一直在找的答案。🔍",
  "你的喜歡，讓它成為獨一無二。🏆",
  "緣分的奇妙，總在不經意間展現。🌌",
  "喜歡的理由千千萬，收藏只需一瞬間。⚡",
  "它的美好，剛好填滿你的想像。🧩",
  "緣分是奇妙的，它來自每一次心動。❤️‍🔥",
  "遇見它，是你的幸運，也是它的榮幸。🎖️",
  "每個被珍藏的物品，都有它的故事。📜",
  "這不是偶然，而是命運的安排。🔔",
  "遇見就是緣分，收藏讓它完整。🧷",
  "你的喜歡，讓這段故事更加美好。🎨",
  "它的存在，是為了成為你的專屬。🏡"
];

function getRandomQuote(): string {
  const randomIndex = Math.floor(Math.random() * FAVORITE_QUOTES.length);
  return FAVORITE_QUOTES[randomIndex];
}

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
        <div className="w-full flex flex-col gap-8">
          <ItemList
            title='我的最愛'
            description={getRandomQuote()}
            series={favorites}
            id={0}
            index={0}
            expandOnMount={true}
            expandable={false}
          />
          <PreviewList
            title='穿搭推薦'
            previews={previews}
            description='您過去上傳的推薦照片都會顯示在此，點擊圖片查看推薦結果'
          />
        </div>
      )}</div>
  </div>;
  return <UnderConstruction />;
}

export default ClosetPage;