"use client";

import { handleRecommendation } from "@/actions/upload";
import { storeImageToStorage } from "@/actions/utils/insert";
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/ui/loading-button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from 'browser-image-compression';
import { motion } from "framer-motion";
import { CheckCircle, ChevronLeft, CircleHelp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnborda } from "onborda";
import { useCallback, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import CustomizationFields from "./customization-fields";
import ImageUploader from "./image-uploader";
import Skeleton from "./skeleton";

const schema = z.object({
  clothingType: z.enum(["top", "bottom"], {
    message: "請選擇服飾類型",
  }),
  gender: z.enum(["male", "female"], { message: "請選擇性別" }),
  model: z.string().default("gpt-4o"),
  uploadedImage: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList, {
        message: "請上傳圖片",
      })
  ).refine((files) => files.length > 0, "請上傳圖片"),
});

// ProgressBar Component
const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return <Progress value={progress} className='w-full rounded-none h-4' />;
};

// ImageUpload Component
const ImageUpload = ({ onImageUpload }: { onImageUpload: () => void }) => {
  const { startOnborda } = useOnborda();
  return (
    <div id='image-uploader' className='w-full flex-1 flex flex-col gap-4 items-center justify-center h-auto'>
      <div className="w-full flex text-gray-600 items-center justify-start gap-2">
        <h1 className='text-start text-2xl'>
          ➊ 照片上傳
        </h1>
        <CircleHelp className="w-4 cursor-pointer" onClick={() => { startOnborda('test') }} />
      </div>
      <ImageUploader onImageUpload={onImageUpload} />
    </div>
  );
};

// FormFields Component
const FormFields = ({ nextStep }: { nextStep: () => void }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { getValues } = useFormContext();

  const onClick = (e: React.FormEvent) => {
    e.preventDefault();
    const values = getValues();
    if (Object.keys(values).every((key) => values[key])) {
      nextStep();
    } else {
      setErrorMessage("請輸入必要欄位");
    }
  };

  return (
    <div id='form-fields' className='flex-1 flex gap-4 flex-col items-center justify-center h-auto'>
      <h1 className='w-full text-start text-2xl text-gray-600'>➋ 基本資訊</h1>
      <CustomizationFields />
      <motion.button
        className='bg-indigo-400 hover:bg-indigo-300 font-bold w-full text-white py-2 rounded-md'
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        下一步
      </motion.button>
      <p className='text-red-400 text-sm'>{errorMessage}</p>
    </div>
  );
};

const toHHMMSS = (secs: number) => {
  var hours = Math.floor(secs / 3600);
  var minutes = Math.floor(secs / 60) % 60;
  var seconds = secs % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

// Overview Component
const Overview = ({
  onConfirm,
  loading,
}: {
  onConfirm: () => void;
  loading: boolean;
}) => {
  const { getValues } = useFormContext();
  const formData = getValues();
  // console.log(formData.uploadedImage[0]);
  return (
    <div id='overview' className='flex-1 flex flex-col items-center justify-center h-auto gap-4'>
      <h1 className='w-full text-start text-2xl text-gray-600'>➌ 確認上傳</h1>
      <div>
        <Image
          src={formData.uploadedImage ? URL.createObjectURL(formData.uploadedImage[0]) : 'https://eapzlwxcyrinipmcdoir.supabase.co/storage/v1/object/public/image/image-018f80af-65bb-48fd-ba2f-43051785c660'}
          alt='Uploaded'
          className='w-80 h-80 object-cover rounded-lg mb-4'
          width={128}
          height={128}
        />
        <div className='flex'>
          <div className='flex flex-row w-full items-center gap-4'>
            <Badge className='bg-indigo-300 hover:bg-indigo-300'>性別</Badge>
            <p>{formData.gender === "male" ? "男性 🙋‍♂️" : "女性 🙋‍♀️"}</p>
          </div>
          <div className='flex flex-row w-full items-center gap-4'>
            <Badge className='bg-indigo-300 hover:bg-indigo-300'>類別</Badge>
            <p>{formData.clothingType === "top" ? "上衣 👕" : "下身 👖"}</p>
          </div>
        </div>
      </div>
      <ConfirmButton />
    </div>
  );
};

function ConfirmButton() {
  const router = useRouter();
  const [secondsSpent, setSecondsSpent] = useState<number>(0);
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      type='submit'
      className='w-full text-white font-bold rounded-lg bg-indigo-400'
    >
      <LoadingButton
        className={cn(
          "transition-opacity duration-300 w-full px-8 py-2 rounded-md",
          secondsSpent > 0
            ? "bg-red-400 hover:bg-red-300"
            : "bg-indigo-400 hover:bg-indigo-300"
        )}
        onClick={() => {
          if (secondsSpent > 0) {
            window.location.reload();
            router.push('/upload?step=1')
          } else {
            setInterval(() => {
              setSecondsSpent((s) => s + 1);
            }, 1000);
          }
        }}
        loading={secondsSpent > 0}
        disabled={false}
      >
        {secondsSpent > 0
          ? `終止並退出`
          : "一鍵成為穿搭達人！"}
      </LoadingButton>
    </motion.button>
  );
}
// ConfirmationAnimation Component
const ConfirmationAnimation = () => {
  return (
    <div className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center'>
      <CheckCircle size={64} className='text-green-500 animate-bounce' />
    </div>
  );
};

// Main Component
export default function UploadPage() {
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get('step') as string) || 1;
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState<boolean>(false);

  // const [currentStep, setCurrentStep] = useState<number>(currentStep ? parseInt(currentStep) : 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const setCurrentStep = (step: number) => {
    router.push(`/upload?step=${step}`);
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleImageUpload = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep(2);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFormSubmission = async () => {
    setTimeout(() => {
      setCurrentStep(3);
      setIsLoading(false);
    }, 1000);
  };

  const handleConfirm = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsConfirmed(true);
      setIsLoading(false);
    }, 1000);
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log(">> submit");
    const reader = new FileReader();
    reader.onloadend = async () => {
      const supabase = createClient();
      if (typeof reader.result === "string") {
        const base64 = reader.result;
        try {
          const imageUrl = await storeImageToStorage(base64);
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const recommendationId = await handleRecommendation(
            data.clothingType,
            data.gender,
            data.model,
            user?.id as string,
            NUM_MAX_SUGGESTION,
            NUM_MAX_ITEM,
            imageUrl
          );
          router.push(`/recommendation/${recommendationId}`);
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

  if (isConfirmed) {
    return <ConfirmationAnimation />;
  }

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className='relative w-full h-screen flex flex-col items-center justify-center'>
      <div className='w-full flex-1 h-auto flex flex-col items-center justify-center gap-4'>
        {
          currentStep === 1 &&
          <div id='recommendation-tabs-list' className="flex w-[20rem] items-center justify-center bg-gray-200 rounded-md py-2 px-0">
            <div className="px-10 rounded-sm py-1 bg-gray-100">新的推薦</div>
            <div className="px-10 rounded-sm py-1 cursor-pointer">
              <Link href='/history'>
                歷史紀錄
              </Link>
            </div>
          </div>
        }
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {currentStep > 1 && (
              <div
                onClick={prevStep}
                className='text-sm font-bold mb-2 flex items-center text-gray-600 cursor-pointer'
              >
                <ChevronLeft className='w-4 h-4' /> 上一步
              </div>
            )}
            {currentStep === 1 && (
              <div className="flex flex-col gap-4">
                
                <ImageUpload onImageUpload={handleImageUpload} />
              </div>
            )}
            {currentStep === 2 && <FormFields nextStep={nextStep} />}
            {currentStep === 3 && (
              <Overview loading={loading} onConfirm={handleConfirm} />
            )}
          </form>
        </FormProvider>
      </div>
      <ProgressBar currentStep={currentStep} totalSteps={3} />
    </div>
  );
}
