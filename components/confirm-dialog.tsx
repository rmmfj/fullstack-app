import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MouseEventHandler, ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { LoadingButton } from "./ui/loading-button";

const ConfirmDialog = ({
  children,
  title,
  text,
  onConfirm,
}: {
  children?: ReactNode;
  title?: string;
  text: string;
  onConfirm: () => Promise<void>;
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    setDialogOpen(false);
  };
  const onOpenClick = async (e: MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };
  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger asChild>
        <div onClick={onOpenClick as unknown as MouseEventHandler}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={() => {
          setDialogOpen(false);
        }}
        onEscapeKeyDown={() => {
          setDialogOpen(false);
        }}
        className='sm:w-[32rem] w-[88vw]'
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {text}
        <DialogFooter>
          <Button variant='outline' onClick={() => setDialogOpen(false)}>
            取消
          </Button>
          <LoadingButton
            loading={loading}
            type='submit'
            className='dark:bg-gray-800'
            variant='default'
            onClick={onSubmit}
          >
            我確定
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
