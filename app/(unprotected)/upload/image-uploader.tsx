"use client";
import imageCompression from "browser-image-compression";
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
    getValues,
    formState: { errors },
  } = useFormContext();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onImageUpload();
    const files = e.target.files;
    const options = {
      maxSizeMB: .1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/jpeg"
    }
    if (files && files[0]) {
      const compressedFile = await imageCompression(files[0], options);
      console.log('uploaded file(s):', files);
      console.log('compressed file(s):', compressedFile);
      setValue("uploadedImage", compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
      console.log(getValues());
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
