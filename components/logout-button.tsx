"use client";

import { signOut } from "@/actions/utils/user";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const onClick = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Button
      variant='outline'
      onClick={onClick}
      className='m-0 p-0 border-0 w-full px-4 text-xs rounded-none'
    >
      <LogOut className='mr-2 h-3 w-3' />
      登出
    </Button>
  );
}