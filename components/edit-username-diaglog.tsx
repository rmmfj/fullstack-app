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
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function EditUsernameDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const [username, setUsername] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    event.preventDefault();
    await updateUserProfile(username);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>更改使用者名稱</DialogTitle>
          <DialogDescription>
            你可以在任何時候，在這裡更改你的使用者名稱。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
            <Button variant='outline' type='submit'>
              儲存變更
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
