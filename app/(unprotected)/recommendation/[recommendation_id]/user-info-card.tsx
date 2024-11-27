import { Gender } from "@/type";
import Image from "next/image";

const UserInfoCard = ({
  imageUrl,
  gender,
}: {
    imageUrl: string;
    gender: Gender;
}) => {
  return (
    <div className='rounded-sm max-w-[92vw] m-0 px-4 flex flex-col items-center justify-center gap-4 border-0 shadow-none'>
      <Image
        src={imageUrl}
        alt='User Photo'
        width={256}
        height={256}
        className='object-cover'
      />
      <div className='flex gap-4 flex-wrap'>
        <div className='flex items-center justify-center gap-2'>
          <div className='text-sm font-medium text-muted-foreground'>性別</div>
          <div className='text-md'>
            {gender === "male" ? "男性" : "女性"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
