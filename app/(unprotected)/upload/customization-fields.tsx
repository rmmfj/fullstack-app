"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";


const CustomizationFields = () => {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const clothingType = watch("clothingType");
  const gender = watch("gender");

  return (
    <Card className='w-128 max-w-[92vw] bg-white'>
      <CardHeader>
        <CardTitle>客製化參數</CardTitle>
        <CardDescription>
          讓模型知道更多資訊以提供您更精確的穿搭建議！
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='gender'>我想搜尋的服飾性別為</Label>
          <div className='flex flex-wrap gap-2'>
            <Label
              htmlFor='gender-male'
              className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer',
                gender === "male" && "bg-muted"
              )}
            >
              <input
                id='gender-male'
                type='radio'
                value='male'
                {...register("gender")}
                onChange={() => setValue("gender", "male")}
              />
              男性
            </Label>
            <Label
              htmlFor='gender-female'
              className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointexr',
                gender === "female" && "bg-muted"
              )}
            >
              <input
                id='gender-female'
                type='radio'
                value='female'
                {...register("gender")}
                onChange={() => setValue("gender", "female")}
              />
              女性
            </Label>
            <Label
              htmlFor='gender-neutral'
              className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer',
                gender === "neutral" && "bg-muted"
              )}
            >
              <input
                id='gender-neutral'
                type='radio'
                value='neutral'
                {...register("gender")}
                onChange={() => {
                  console.log('neutral')
                  setValue("gender", "neutral")
                }}
              />
              無限制
            </Label>
          </div>
          {errors.gender && (
            <span className='text-red-600'>
              {errors.gender.message?.toString()}
            </span>
          )}
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='clothing-type'>我上傳的服飾是</Label>
          <div className='flex flex-wrap gap-2'>
            <Label
              htmlFor='clothing-type-top'
              className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${clothingType === "top" ? "bg-muted" : ""
                }`}
            >
              <input
                id='clothing-type-top'
                type='radio'
                value='top'
                {...register("clothingType")}
                onChange={() => setValue("clothingType", "top")}
              />
              上衣
            </Label>
            <Label
              htmlFor='clothing-type-bottom'
              className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${clothingType === "bottom" ? "bg-muted" : ""
                }`}
            >
              <input
                id='clothing-type-bottom'
                type='radio'
                value='bottom'
                {...register("clothingType")}
                onChange={() => setValue("clothingType", "bottom")}
              />
              下身
            </Label>
          </div>
          {errors.clothingType && (
            <span className='text-red-600'>
              {errors.clothingType.message?.toString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizationFields;
