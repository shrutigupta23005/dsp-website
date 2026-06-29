"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "default";
}

export default function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  isLoading: externalIsLoading,
  variant = "default",
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const isLoading = externalIsLoading || localLoading;

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  const confirmBtnStyles = cn(
    "font-mono font-medium rounded-lg text-xs uppercase px-4 h-9 flex items-center justify-center transition-colors cursor-pointer",
    variant === "danger" && "bg-[#EF4444] text-white hover:bg-[#EF4444]/90",
    variant === "warning" && "bg-[#F59E0B] text-black hover:bg-[#F59E0B]/90",
    variant === "default" && "bg-[#C9933A] text-[#0F0F0F] hover:bg-[#E5AC52]"
  );

  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && setOpen(val)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-[#1A1A1A] border-[#242424] text-[#F5F5F5] rounded-2xl max-w-md p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold text-[#F5F5F5] font-sans">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B6B6B] font-sans">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 justify-end mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              disabled={isLoading}
              variant="outline"
              className="border-[#2A2A2A] text-[#6B6B6B] bg-transparent hover:border-[#C9933A] hover:text-[#F5F5F5] font-sans rounded-lg text-xs h-9 cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={confirmBtnStyles}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                Processing
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
