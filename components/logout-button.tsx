"use client";

import { signOut } from "@/actions/utils/user";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function LogoutButton({ isMobile } : { isMobile?: boolean }) {
  const router = useRouter();

  const onClick = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Button
      variant='outline'
      onClick={onClick}
      className={cn('bg-transparent text-red-400 hover:text-red-500 hover:bg-red-100 m-0 p-0 border-0 w-full px-4 rounded-none', isMobile ? 'text-md' : 'text-xs')}
    >
      <LogOut className={cn(isMobile ? 'mr-3' : 'mr-2', isMobile ? 'h-4 w-4' : 'h-3 w-3')} />
      登出
    </Button>
  );
}