"use client";

import {
  getProfileByUserId
} from "@/actions/utils/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileTable } from "@/type";
import { createClient } from "@/utils/supabase/client";
import { User as UserType } from "@supabase/supabase-js";
import { Camera, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import EditUsernameDialog from "./edit-username-diaglog";
import LogoutButton from "./logout-button";

export default function AvatarMenu() {
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<ProfileTable | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditUsernameDialogOpen, setIsEditUsernameDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const profile = await getProfileByUserId(user?.id as string);
      setUser(user);
      setProfile(profile);
    })();
  }, []);

  const handleEditUsernameMenuItem = () => {
    setIsEditUsernameDialogOpen(true);
  };

  // const handleChangeProfilePicture = async () => {
  //   console.log("Change profile picture clicked");
  //   const supabase = createClient();
  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();
  //   await updateUserProfile(location.origin, user?.id as string);
  //   // Implement profile picture change logic here
  // };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
            <Avatar className='h-10 w-10'>
              <AvatarImage
                src={profile?.avatar_url as string}
                alt={`${profile?.username}'s Avatar`}
              />
              <AvatarFallback>{profile?.username}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-fit' align='end' forceMount>
          <DropdownMenuLabel className='font-normal flex gap-4'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {profile?.username}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>
                {user?.email}
              </p>
            </div>
            
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className='cursor-pointer'
            onClick={handleEditUsernameMenuItem}
          >
            <Tag className='mr-2 h-4 w-4' />
            <span>更改使用者名稱</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            // onClick={handleChangeProfilePicture}
          >
            <Camera className='mr-2 h-4 w-4' />
            <span>更改使用者頭像</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="flex w-full justify-end">
            <LogoutButton />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditUsernameDialog
        open={isEditUsernameDialogOpen}
        setOpen={setIsEditUsernameDialogOpen}
      />
    </>
  );
}
