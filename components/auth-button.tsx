"use client";

import { signOut } from "@/actions/utils/user";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function AuthButton({ isMobile }: { isMobile?: boolean }) {
  const router = useRouter();

  const onClick = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Button
      variant='outline'
      onClick={onClick}
      className={cn('m-0 p-0 border-0 w-fit px-4', isMobile ? 'text-md' : 'text-xs')}
    >
      <LogIn className={cn(isMobile ? 'mr-3' : 'mr-2', isMobile ? 'h-4 w-4' : 'h-3 w-3')} />
      登入／註冊
    </Button>
  );
}