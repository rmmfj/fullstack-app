"use client";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

const ImageUploader = ({
  onImageUpload,
  className,
}: {
  onImageUpload: () => void;
  className?: string;
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageUpload();
    const files = e.target.files;
    if (files && files[0]) {
      setValue("uploadedImage", files);
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-2 '>
      <div
        onClick={handleFileClick}
        className='cursor-pointer rounded-sm w-80 h-80 border-2 border-dashed border-gray-400/80 flex-col flex gap-4 items-center justify-center relative'
      >
        {preview ? (
          <Image
            src={preview}
            alt='Uploaded Image'
            fill
            className='object-cover'
          />
        ) : (
          <Upload className='w-10 h-10 text-gray-400' />
        )}
        <div className='mb-2 text-sm text-gray-500'>
          <span className='font-semibold text-indigo-400'>點擊上傳</span>{" "}
          或拖放圖片
        </div>
        <input
          {...register("uploadedImage")}
          ref={fileInputRef}
          id='uploadedImage'
          className='hidden'
          type='file'
          accept='image/*'
          onChange={handleFileChange}
        />
      </div>
      {errors.uploadedImage && (
        <span className='text-red-600'>
          {errors.uploadedImage.message?.toString()}
        </span>
      )}
    </div>
  );
};

export default ImageUploader;
