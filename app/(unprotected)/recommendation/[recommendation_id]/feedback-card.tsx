import FeedbackArea from "@/components/feedback-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FeedbackCard = () => {
  return (
    <div className='w-[50rem] max-w-[92vw] bg-muted rounded-lg p-4 flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>對推薦結果不太滿意嗎？</h3>
        <Button variant='link' className='inline-block'>
          再試一次
        </Button>
      </div>
      <p className='text-sm text-muted-foreground'>
        請再給我們一次機會吧😊
        點擊重新推薦按鈕，我們會根據您的意見進行調整，力求給您更棒的穿搭建議。感謝您的支持！✨
      </p>

      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='feedback'>
          <AccordionTrigger>給予寶貴回饋</AccordionTrigger>
          <AccordionContent className='flex flex-col gap-4'>
            <p className='text-sm text-muted-foreground'>
              您的寶貴回饋對我們來說非常重要！🙏
              每一條意見都是我們向前的動力，幫助我們不斷改進和提升服務品質。請花點時間分享您的想法和建議，讓我們一起變得更好。感謝您的支持！🌟
            </p>
            <FeedbackArea />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FeedbackCard;
