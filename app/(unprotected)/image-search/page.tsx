"use client";

import { getLabelStringForImageSearch, handleSearch } from "@/actions/search";
import { storeImageToStorage } from "@/actions/utils/insert";
import ItemList from "@/components/item/item-list";
import ItemListSkeleton from "@/components/item/item-list-skeleton";
import PaginationBar from "@/components/pagination-bar";
import { LoadingButton } from "@/components/ui/loading-button";
import { Series } from "@/type";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from 'browser-image-compression';
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import CustomizationFields from "./customization-fields";
import ImageUploader from "./image-uploader";
import Skeleton from "./skeleton";


const schema = z.object({
  gender: z.enum(["male", "female", "neutral"], { message: "請選擇性別" }),
  uploadedImage: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList, {
        message: "請上傳圖片",
      })
  ).refine((files) => files.length > 0, "請上傳圖片"),
});

const ImageUpload = ({ onImageUpload }: { onImageUpload: () => void }) => {
  
  return (
    <div id='image-uploader' className='w-full flex-1 flex flex-col gap-4 items-center justify-center h-auto'>
      <div className="w-full flex text-gray-600 items-center justify-start gap-2">
        {/* <h1 className='text-start text-2xl'>
          以服搜服
        </h1> */}
        {/* <TourButton tourName='recommendation' /> */}
      </div>
      <ImageUploader onImageUpload={onImageUpload} />
    </div>
  );
};

const FormFields = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { getValues } = useFormContext();

  return (
    <div id='form-fields' className='flex-1 flex gap-4 flex-col items-center justify-center h-auto'>
      <CustomizationFields />
    </div>
  );
};

function ConfirmButton({ isConfirmed, disabled }: { isConfirmed: boolean, disabled: boolean }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="w-full text-white font-bold rounded-lg bg-indigo-400 hover:bg-indigo-300"
    >
      <LoadingButton
        className="transition-opacity duration-300 w-full px-8 py-2 rounded-md bg-indigo-400 hover:bg-indigo-300"
        type='submit'
        loading={isConfirmed}
        disabled={disabled || isConfirmed}
      >
        一鍵尋找類似的服飾！
      </LoadingButton>
    </motion.div>
  );
}

export default function ImageSearchPage() {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  const { getValues } = methods;
  const [loading, setLoading] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const [results, setResults] = useState<Series[]>([]);
  const [image, setImage] = useState<string>("");
  const [gender, setGender] = useState<string>("neutral");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [labelString, setLabelString] = useState<string>("");
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      router.push('/image-search');
    }
    (async () => {
      const supabase = createClient();
      const {
        data: { user: userResponse },
      } = await supabase.auth.getUser();
      if (userResponse) {
        setUserId(userResponse?.id as string);
      }
    })();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setIsConfirmed(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result;
        const filename = data.uploadedImage[0].name;
        try {
          const imageUrl = await storeImageToStorage(base64, filename);
          setImage(imageUrl);
          setGender(data.gender);
          // const labelString
          const result  = await getLabelStringForImageSearch(data.gender, "gpt-4o-mini", imageUrl);
          console.log("clothing_type:", result.clothing_type);
          console.log("gender: ", result.gender);
          setLabelString(result.labelString);
          console.log(labelString);
          const res = await handleSearch(
            result.labelString,
            data.gender,
            1,
            userId,
            undefined,
            undefined,
            undefined,
            result.clothing_type
          );
          setIsConfirmed(false);
          setResults([...(res?.series ?? [])] as Series[]);
          setTotalPages(res?.totalPages as number);
          setLoading(false);
          setImageChanged(false);
        } catch (error) {
          console.error("Error in onSubmit:", error);
        }
      }
    };

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    try {
      const compressedFile = await imageCompression(data.uploadedImage[0], options);
      reader.readAsDataURL(compressedFile);
  
    } catch (error) {
      console.log(error);
    }
    
    const NUM_MAX_SUGGESTION: number = 3;
    const NUM_MAX_ITEM: number = 10;
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if(results.length === 0) {
    return (
      <div className='relative w-full h-screen flex flex-col items-center justify-center'>
        <div className='w-full flex-1 h-auto flex flex-col items-center justify-center gap-4'>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <ImageUpload onImageUpload={() => {}} />
                <FormFields />
                <ConfirmButton isConfirmed={isConfirmed} disabled={!getValues()['uploadedImage'] || getValues()['uploadedImage'].length === 0 || !gender}/>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    )
  }else {
    return (
    <div className='relative w-full h-screen flex flex-col items-center justify-start'>
        <div className='w-full flex-1 h-auto flex flex-col items-center justify-start gap-4'>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <ImageUpload onImageUpload={() => {setImageChanged(true)}} />
                <div className="flex justify-center text-gray-400">點擊圖片更換上傳內容</div>
                <FormFields />
                <ConfirmButton isConfirmed={isConfirmed} disabled={!getValues()['uploadedImage'] || getValues()['uploadedImage'].length === 0 || !gender || !imageChanged}/>
              </div>
            </form>
          </FormProvider>
        </div>
        <div className='flex flex-col gap-4 justify-center items-center md:max-w-[80vw]'>
        {loading ? (
            <ItemListSkeleton index={0} />
          ) : (
            <div className='flex flex-col gap-4 justify-center items-center md:max-w-[80vw]'>
              <ItemList
                title='搜尋結果'
                description={""}
                series={results}
                id={0}
                index={0}
                expandOnMount={true} expandable={false} />
                {
                  results.length > 0 &&
                  <div className="mt-8 w-full flex items-center justify-center">
                    <PaginationBar
                      currentPage={page}
                      totalPages={totalPages}
                        onPageChange={async (page: number) => {
                          setPage(page);
                          setLoading(true);
                          console.log(labelString)
                          const res = await handleSearch(labelString, gender, page, userId);
                          console.log(res);
                          setResults([...(res?.series as Series[])] as Series[]);
                          setLoading(false);
                        }}
                    />
                  </div>
                }
            </div>
          )}
        </div>
      </div>
    )
  }
}