"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import ResultWindow from "./result-window";
import Section from "./section";

const images = [
  "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-750cc231-23d4-436a-a085-7286e0fdeed3?t=2024-09-25T17%3A20%3A26.729Z",
  "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-73bd431f-c7b5-41e1-8c23-2843057755bb",
  "https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-00ee47f4-8768-42d9-b68b-29a0702243ea",
];

function DragAndDropImageUploaderMock({
  droppedImage,
  handleImageDrop,
}: {
  droppedImage: string | null;
  handleImageDrop: (x: string) => void;
}) {
  const draggedImageRef = useRef<string | null>(null);
  const constraintsRef = useRef(null);

  const handleDragStart =
    (src: string) => (event: MouseEvent | TouchEvent | PointerEvent) => {
      draggedImageRef.current = src;
      // We can't use dataTransfer here because it's not available on PointerEvent
      // Instead, we'll use our ref to store the dragged image source
    };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent) => {
    // Check if the drag ended over the drop zone
    const dropZone = document.getElementById("drop-zone");
    if (dropZone) {
      const rect = dropZone.getBoundingClientRect();
      const { clientX, clientY } =
        event instanceof MouseEvent
          ? event
          : (event as unknown as PointerEvent);
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        // The drag ended over the drop zone
        if (draggedImageRef.current) {
          handleImageDrop(draggedImageRef.current);
        }
      }
    }
    draggedImageRef.current = null;
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedImageSrc = event.dataTransfer.getData("text/plain");
    if (droppedImageSrc) {
      handleImageDrop(droppedImageSrc);
    }
  };

  return (
    <div className='flex flex-col items-center md:flex-row gap-8'>
      <div
        ref={constraintsRef}
        className='flex flex-row md:flex-col items-center justify-center space-y-4'
      >
        {images.map((src, index) => {
          return (
            <motion.div
              drag
              dragElastic={0.5}
              key={index}
              dragConstraints={constraintsRef}
              onDragStart={handleDragStart(src)}
              onDragEnd={handleDragEnd}
              className='cursor-grab active:cursor-grabbing'
            >
              <motion.img
                src={src}
                alt={`Draggable image ${index + 1}`}
                draggable='false'
                className={cn(
                  "w-24 h-24 rounded-lg shadow-md",
                  droppedImage === src && "hidden",
                  droppedImage && "opacity-50"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            </motion.div>
          );
        })}
      </div>
      <motion.div
        id='drop-zone'
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className='w-[20rem] h-[20rem] max-w-[75vw] flex flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 overflow-hidden border-2 border-gray-300 border-dashed'
      >
        {droppedImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className=''
          >
            <Image
              src={droppedImage}
              alt='Dropped image'
              width='256'
              height='256'
              style={{objectFit:"cover"}}
              className='w-full animate-pulse'
            />
          </motion.div>
        ) : (
          <div className='animate-pulse flex flex-col items-center justify-center pt-5 pb-6'>
            <Upload className='w-10 h-10 mb-3 text-gray-400' />
            <p className='mb-2 text-sm text-gray-500'>
              <span className='font-semibold'>點擊上傳</span> 或拖放圖片
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const RecommendationSection = () => {
  const [droppedImage, setDroppedImage] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const handleImageDrop = (imgUrl: string) => {
    setDroppedImage(imgUrl);
    setTimeout(() => {
      setLoaded(true);
    }, 1200);
  };
  return (
    <Section
      id='recommendation-feature'
      title='推薦功能'
      slogan='上傳搭配，輕鬆找到專屬穿搭靈感！'
      description={
        `上傳您的上半身或下半身穿搭圖片，
        系統會自動推薦三種搭配的建議！
        這個功能特別適合已經購買了一件衣服但不確定如何搭配的使用者，
        試試看把衣服拖曳進視窗來找找推薦的搭配吧。`
      }
      buttonText="感受專屬的穿搭推薦！"
      buttonLink='/upload'
    >
      {!loaded && (
        <DragAndDropImageUploaderMock
          droppedImage={droppedImage}
          handleImageDrop={handleImageDrop} />
      )}
      {loaded && (
        <ResultWindow
          close={() => {
            setDroppedImage(null);
            setLoaded(false);
          } }
          index={droppedImage ? (images.indexOf(droppedImage) as 0 | 1 | 2) : 0} />
      )}
    </Section>
  );
};

export default RecommendationSection;
