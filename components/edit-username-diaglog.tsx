"use client";

import { updateUserProfile } from "@/actions/utils/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useToast } from './ui/use-toast';

export default function EditUsernameDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const [username, setUsername] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (username.length > 20) {
      toast({
        title: '❌ 名稱更改失敗',
        description: '你的名稱超過 20 個字元啦，請縮短一些再試試吧！📝',
      })
      return;
    }
    const ok = await updateUserProfile(pathname, username);
    if (ok) {
      toast({
        title: '🎉 名稱更改成功',
        description: '你的新名稱已更新，重新整理看看吧！✨',
      })
      setUsername('');
      setOpen(false);
    } else {
      toast({
        title: '❌ 名稱更改失敗',
        description: '可能是網路問題，請稍後再試一次哦！🔄',
      })
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px] max-w-[85vw]'>
        <DialogHeader>
          <DialogTitle>更改使用者名稱</DialogTitle>
          <DialogDescription>
            你可以在任何時候，在這裡更改使用者名稱。使用者名稱長度不可超過 20 個字元。
          </DialogDescription>
        </DialogHeader>
          <div className='flex flex-col gap-4 py-4'>
            <div className='flex flex-col items-start gap-4'>
              <Label htmlFor='new-username' className='text-right text-wrap'>
                新使用者名稱
              </Label>
              <Input
                id='new-username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={handleSubmit}>
              儲存
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
