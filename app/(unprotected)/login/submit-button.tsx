"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <Button
      variant='outline'
      className='w-full flex items-center justify-center gap-2'
      type='submit'
      aria-disabled={pending}
    >
      {isPending ? pendingText : children}
    </Button>
  );
}
