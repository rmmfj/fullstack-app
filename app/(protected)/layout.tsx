"use server";

import { createProfile } from "@/actions/utils/user";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  // Get the user data
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Handle error if getUser fails
  if (error || !user) {
    // Redirect the user to the login page if not authenticated
    redirect("/login");
    return null; // T o prevent rendering if the user is being redirected
  }

  await createProfile(user.id);
  // Render the children if the user is authenticated

  return (
    <div className='flex flex-grow w-full h-[93vh] bg-gray-100 text-gray-800'>
      <div className='flex-1 flex flex-col overflow-y-scroll min-w-[100vw]'>{children}</div>
    </div>
  );
}
