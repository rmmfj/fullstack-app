"use client";

import { storeImageToStorage } from "@/actions/utils/insert";
import ItemList from "@/components/item/item-list";
import ItemListSkeleton from "@/components/item/item-list-skeleton";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Gender, Series } from "@/type";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { cn } from "@/lib/utils";
import imageCompression from 'browser-image-compression';


const schema = z.object({
  uploadedImage: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList, {
        message: "請上傳圖片",
      })
  ).refine((files) => files.length > 0, "請上傳圖片"),
});

export default function ImageSearch() {
  const [gender, setGender] = useState<Gender>('neutral');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Series[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false);


  const handleImageUpload = async () => {
    if (!uploadedImageUrl) return;
    setLoading(true);
    // const res = await handleSearch(
    //   gender,
    //   "gpt-4o-mini",
    //   uploadedImageUrl,
    //   1
    // );
    // setResults([...(res?.series ?? [])] as Series[]);
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return; // User canceled file selection
    }
    setImageUploading(true);
    const file = event.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result;
        const filename = file.name;
        try {
          const imageUrl = await storeImageToStorage(base64, filename);
          /* TODO: Perform image search with the image uarl */
          setUploadedImageUrl(imageUrl);
          setImageUploading(false);
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
      const compressedFile = await imageCompression(file, options);
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex w-full gap-2'>
          <div className='relative mb-8 w-full'>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Input
                  id='picture'
                  type='file'
                  accept='image/*'
                  className='col-span-4'
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            <div className='flex items-center gap-4 pl-2'>
              <label htmlFor='gender'>性別</label>
              <div className='flex gap-2'>
                <label
                  htmlFor='gender-neutral'
                  className={cn(`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer`,
                    gender === "neutral" ? "bg-gray-200" : ""
                  )}
                >
                  <input
                    id='gender-neutral'
                    type='radio'
                    value='neutral'
                    checked={gender === "neutral"}
                    onChange={() => setGender("neutral")}
                    className='hidden'
                  />
                  無限制
                </label>
                <label
                  htmlFor='gender-male'
                  className={cn(`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer`,
                    gender === "male" ? "bg-gray-200" : ""
                  )}
                >
                  <input
                    id='gender-male'
                    type='radio'
                    value='male'
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                    className='hidden'
                  />
                  男性
                </label>
                <label
                  htmlFor='gender-female'
                  className={cn(`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer`,
                    gender === "female" ? "bg-gray-200" : ""
                  )}
                >
                  <input
                    id='gender-female'
                    type='radio'
                    value='female'
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    className='hidden'
                  />
                  女性
                </label>
              </div>
            </div>
          
          </div>
          <div className="flex py-4">
            <LoadingButton
              className='bg-indigo-400 hover:bg-gray-200'
              disabled={imageUploading}
              loading={loading}
              onClick={handleImageUpload}
            >
              {!loading && <SearchIcon />}
            </LoadingButton>
          </div>
        </div>


      </div>
      {loading ? (
        <ItemListSkeleton index={0} />
      ) : (
        <ItemList
          title=''
          description={""}
          series={results}
          id={""}
          index={0}
          expandOnMount={true}
          expandable={false}
        />
      )}
    </div>
  );
}
