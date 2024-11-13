"use client";

import { signOut } from "@/actions/utils/user";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function AuthButton() {
  const router = useRouter();

  const onClick = async () => {
    await signOut();
    router.push("/login");
  };
  return (
    <div className='flex items-center gap-4'>
      <Button
        variant='destructive'
        onClick={onClick}
        className='bg-red-400 hover:bg-red-300 py-2 px-4 w-full'
      >
        登出
      </Button>
    </div>
  );
}