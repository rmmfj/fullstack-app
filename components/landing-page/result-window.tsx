import ImageCarousel from "@/components/image-carousel";
import { Tab } from "@/components/tab";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ResultWindowSkeleton from "./result-window-skeleton";

{
  /* TODO: Produce content for text search */
}

const TEXT_SEARCH_TABS = [];

{
  /* TODO: Produce content for image search */
}

const IMAGE_SEARCH_TABS = [];

{
  /* TODO: Produce content for recommendation */
}
const RECOMMENDATION_TABS = [
  [
    {
      label: "時尚休閒風",
      description:
        "搭配牛仔褲可營造輕鬆隨意的夏季造型，適合約會或聚會。",
      images: [
        "https://lp2.hm.com/hmgoepprod?set=source[/16/e1/16e1ea316defe90fda0fe982fc83785cb590096a.jpg],origin[dam],category[ladies_jeans_wide],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://pics.meierq.com/meierq/ProductBasics/4543415a-b378-46ee-b83b-899b87096893_w198_h252.jpg",
        "https://s3.hicloud.net.tw/fifty/new_women/02489351002/41-2.jpg",
        "https://pics.pzcdn.tw/pazzo/ProductCovers/cff876cd-7f8a-4e76-9c80-444756bed2cc_w198_h252.jpg",
        "https://lp2.hm.com/hmgoepprod?set=source[/54/aa/54aa43be31e99297da9f91751afc99e07cc695cc.jpg],origin[dam],category[ladies_jeans_straight],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
      ],
    },
    { label: "休閒運動風",
      description: "這種搭配完美結合了舒適與時尚，非常適合日常外出。",
      images: [
        "https://lp2.hm.com/hmgoepprod?set=source[/66/c6/66c60be4e8f175c5f3a357b3ecc5be562e1a8d56.jpg],origin[dam],category[ladies_basics_trousersleggings],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://static.zara.net/assets/public/9f3b/887b/11e44610bb05/d841be29b51d/00085472251-p/00085472251-p.jpg?ts=1730635172956&w=343",
        "https://lp2.hm.com/hmgoepprod?set=source[/a6/11/a6110a07be5725ef071fccc462cc3b260f5b5e98.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/12/63/1263e6c4ab5a1826d3d2408dca6569ad96385c12.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/d0/32/d03203023451f3a688de4da28570ee65daf6bbb0.jpg],origin[dam],category[ladies_sport_bottoms_trousers],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
      ] },
    { label: "優雅知性風",
      description: "搭配一條及膝裙能增添女性魅力，適合辦公室或正式場合。",
      images: [
        "https://lp2.hm.com/hmgoepprod?set=source[/2f/76/2f768694edfbf5d506f26f329279fefd2a02595a.jpg],origin[dam],category[Ladies_skirts_pencil],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/2a/0f/2a0f18d0c8bd18bb7f357ed21e1f98e8d87a9945.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/b8/f9/b8f911658e776b0446e96dcbde20f9b53658126c.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/5b/d0/5bd0ba2ff147a106ea09da358b359fdbf9ff674e.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/0d/70/0d70de61d85fa8bf23b161f9c7d68d14934ad028.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]"
      ] },
  ],
  [
    { label: "運動風",
      description: "搭配運動外套，增加活力氣息，適合運動及戶外活動。",
      images: [
        "https://static.zara.net/assets/public/ac0e/7a00/50c447e68e91/25adcd3b5d16/06096306990-p/06096306990-p.jpg?ts=1730626003459&w=343",
        "https://lp2.hm.com/hmgoepprod?set=source[/27/32/273200413d3adc369a37910604a763fb2e2e11ea.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/0e/61/0e61ebeb87bddda38156a584c6c13155d4273432.jpg],origin[dam],category[men_jacketscoats_function],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://static.zara.net/assets/public/7a63/3fd9/cc334adbb47d/a72187fa46a7/02888430800-p/02888430800-p.jpg?ts=1730632517202&w=343",
        "https://lp2.hm.com/hmgoepprod?set=source[/30/f1/30f12b5a924806a327db1da5332b64efc5c7059c.jpg],origin[dam],category[men_jacketscoats_jackets],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
      ] },
    { label: "休閒風",
      description: "搭配鬆身的T恤，增添休閒感，適合日常穿著。",
      images: [
        "https://lp2.hm.com/hmgoepprod?set=source[/a9/dc/a9dc669589ad414b8442a37f29441cd45675fbe1.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/3b/fd/3bfdb833e55e945e581c39dcf47ad04fb06608a4.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/dc/11/dc11be25336ecb979fcbf96b77cd54d439941de9.jpg],origin[dam],category[men_tshirtstanks_shortsleeve],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/80/c2/80c2cabbabc937b0a81021c818e535768e8f20f8.jpg],origin[dam],category[men_tshirtstanks_shortsleeve],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://static.zara.net/assets/public/52d9/d2a0/b4844f95a6ff/d2729374ae6e/00722320800-p/00722320800-p.jpg?ts=1718720417811&w=343",
      ] },
    { label: "街頭風",
      description: "搭配寬鬆的襯衫，營造隨性的街頭風格，適合休閒出行。",
      images: [
        "https://lp2.hm.com/hmgoepprod?set=source[/00/95/009551b08dffaad1f67889513e252ab1d13665cf.jpg],origin[dam],category[men_shirts_flannel],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://static.zara.net/assets/public/d347/193b/3086439ebb2b/6fe98ee67999/06048301712-p/06048301712-p.jpg?ts=1730635978742&w=343",
        "https://static.zara.net/assets/public/af78/fa86/b47a4f4eb85b/35020004c432/07545341821-p/07545341821-p.jpg?ts=1730637870238&w=343",
        "https://static.zara.net/assets/public/0a89/e34b/961b44a99683/86eb60a20646/06786390800-p/06786390800-p.jpg?ts=1730631879721&w=343",
        "https://static.zara.net/assets/public/11e1/0e44/b4fb4efebcff/982445977086/06917446806-p/06917446806-p.jpg?ts=1716803056120&w=343",
      ] },
  ],
  [
    { label: "簡約商務休閒風",
      description: "這種搭配可以在辦公和休閒之間靈活轉換。",
      images: [
        "https://static.zara.net/assets/public/0b1d/d885/3a744003a889/87ea4f5cf305/04164406711-p/04164406711-p.jpg?ts=1715844311972&w=343",
        "https://static.zara.net/assets/public/8a7d/cbb3/57df49fa906e/f4b3e3080ce9/06330300737-p/06330300737-p.jpg?ts=1730637565499&w=343",
        "https://static.zara.net/assets/public/bbcb/1ffd/12864115817f/0a5a2dd43363/09794312800-p/09794312800-p.jpg?ts=1730637950769&w=343",
        "https://www.uniqlo.com/tw/hmall/test/u0000000016752/sku/561/COL09.jpg",
        "https://static.zara.net/assets/public/51ca/0a01/30074a3895a6/61fc92a03a1f/01362301401-p/01362301401-p.jpg?ts=1717668273236&w=343",
      ] },
    { label: "休閒街頭風",
      description: "適合年輕人，展現隨意且時尚的感覺。",
      images: [
        "https://lp2.hm.com/hmgoepprod?set=source[/2c/57/2c5777c9c5a41214d5c168c4348e2ec4f7f678eb.jpg],origin[dam],category[men_jeans_loose],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/77/c0/77c023973e08f908ca809f4d71e209b10c212581.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/26/92/2692bdf3e0b1b1c5daa1e173a3f2d4b5e871220b.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://lp2.hm.com/hmgoepprod?set=source[/86/8c/868c7279d2cc50e4739a9aa085a5a6009ff4feb5.jpg],origin[dam],category[men_jeans_loose],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
      ] },
    { label: "休閒運動風",
      description: "這種風格能夠與上衣形成統一感，適合日常出行。",
      images: [
        "https://lp2.hm.com/hmgoepprod?set=source[/3b/c0/3bc0c8ff7e99160e8866b8679fb35eb5743dfcc5.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://static.zara.net/assets/public/93d8/52ff/86d34530be72/7703ef86e612/09252400800-p/09252400800-p.jpg?ts=1705480914747&w=343",
        "https://lp2.hm.com/hmgoepprod?set=source[/f5/bc/f5bc250bcbeb23660c254ce48127c1e2580f724b.jpg],origin[dam],category[men_sport_bottoms_shorts],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/style]",
        "https://static.zara.net/assets/public/9768/8b18/a07c4e8cb111/187bdd7283cb/01943401251-p/01943401251-p.jpg?ts=1730625253451&w=343",
      ] },
  ],
];

const ResultWindow = ({
  index,
  close,
}: {
  index: 0 | 1 | 2;
  close: () => void;
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode='wait'>
      {isLoading ? (
        <motion.div
          key='skeleton'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResultWindowSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key='content'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='w-[32rem] max-w-[85vw] fit rounded-md bg-white overflow-hidden shadow-[0_1px_1px_hsla(0,_0%,_0%,_0.075),_0_2px_2px_hsla(0,_0%,_0%,_0.075),_0_4px_4px_hsla(0,_0%,_0%,_0.075),_0_8px_8px_hsla(0,_0%,_0%,_0.075),_0_16px_16px_hsla(0,_0%,_0%,_0.075)] flex flex-col gap-4 p-4'
        >
          <div className='w-full flex gap-2'>
            <div
              onClick={close}
              className='cursor-pointer w-3 h-3 bg-red-400 rounded-full'
            ></div>
            <div className='w-3 h-3 bg-yellow-400 rounded-full'></div>
            <div className='w-3 h-3 bg-green-400 rounded-full'></div>
          </div>
          <nav className='flex rounded-t-2 border-b border-b-[#eeeeee] overflow-hidden h-fit'>
            {RECOMMENDATION_TABS[index].map((tab, idx) => (
              <Tab
                key={`${index}-${tab.label}-${index * idx}`}
                label={tab.label}
                isSelected={selectedTabIndex === idx}
                onClick={() => setSelectedTabIndex(idx)}
              />
            ))}
          </nav>
          <ImageCarousel
            imageUrls={RECOMMENDATION_TABS[index][selectedTabIndex].images}
          />
          <p className='text-gray-600 text-center text-sm italic'>
            {RECOMMENDATION_TABS[index][selectedTabIndex].description}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultWindow;
