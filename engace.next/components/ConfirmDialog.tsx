"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Hủy",
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white backdrop-blur-md border border-white/20 shadow-xl dark:bg-slate-800/70 dark:border-slate-700/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-white">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 dark:text-slate-300">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end">
          <AlertDialogCancel
            className="bg-slate-500/20 backdrop-blur-sm border border-slate-200/50 text-slate-700 hover:bg-slate-500/40 dark:bg-slate-700/50 dark:border-slate-600/50 dark:text-slate-300 dark:hover:bg-slate-600/80"
            onClick={onClose}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-gradient-to-r from-red-500/90 to-red-400/90 backdrop-blur-sm text-white hover:from-red-600/90 hover:to-red-500/90"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
