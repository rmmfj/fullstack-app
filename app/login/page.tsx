import { createProfile } from "@/actions/utils/user";
import GoogleLoginButton from "@/components/google-login-button";
import supabase from "@/lib/supabaseClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const headersObject = await headers();

  const origin = headersObject.get("origin");

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=無法登入");
    }

    return redirect("/manage");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    // const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.log(error.message);
      return redirect("/login?message=無法登入");
    }

    await createProfile(data.user?.id as string);

    return redirect("/manage");
  };

  return (
    <div className='flex items-center flex-col w-full px-8 sm:max-w-md justify-center gap-2 pt-8'>
      <form className='animate-in flex flex-col w-full justify-center gap-2 text-foreground'>
        <label className='text-md' htmlFor='email'>
          電子郵件
        </label>
        <input
          className='rounded-md px-4 py-2 bg-inherit border mb-6'
          name='email'
          placeholder='you@example.com'
          required
        />
        <label className='text-md' htmlFor='password'>
          密碼
        </label>
        <input
          className='rounded-md px-4 py-2 bg-inherit border mb-6'
          type='password'
          name='password'
          placeholder='••••••••'
          required
        />
        {resolvedSearchParams?.message && (
          <p className='mt-4 p-4 bg-foreground/10 text-foreground text-center'>
            {resolvedSearchParams.message}
          </p>
        )}
        <SubmitButton
          formAction={signIn}
          className='bg-green-700 rounded-md px-4 py-2 text-foreground mb-2'
          pendingText='Signing In...'
        >
          登入
        </SubmitButton>
        <SubmitButton
          formAction={signUp}
          className='border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2'
          pendingText='Signing Up...'
        >
          註冊
        </SubmitButton>
      </form>
      <GoogleLoginButton />
    </div>
  );
}
