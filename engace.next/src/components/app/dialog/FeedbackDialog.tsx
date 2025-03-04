"use client";

import { useState } from "react";
import { API_DOMAIN } from "@/lib/config";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const feedbackPlaceholder = `• Bạn đã sử dụng EngAce trong bao lâu?
• Bạn thích điều gì nhất về EngAce?
• EngAce hỗ trợ bạn học tập có hiệu quả không?
• Bạn muốn cải thiện tính năng nào và cải thiện như thế nào?
• Nội dung học tập có phù hợp với trình độ của bạn không?
• Bạn gặp khó khăn gì khi sử dụng EngAce?
• Bạn muốn thêm tính năng gì mới?
• Giao diện người dùng có dễ sử dụng không?
• . . .`;

export default function FeedbackDialog({
  isOpen,
  onClose,
  userName,
}: FeedbackDialogProps) {
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setFeedbackText(text);
      setCharCount(text.length);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (feedbackText.trim().length < 10) {
      setError("Phản hồi cần ít nhất 10 ký tự");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_DOMAIN}/api/Healthcheck/SendFeedback?userName=${encodeURIComponent(
          userName
        )}`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedbackText),
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Không thể kết nối đến máy chủ"
            : response.status === 400
            ? "Yêu cầu không hợp lệ"
            : "Có lỗi xảy ra khi gửi phản hồi"
        );
      }

      setShowSuccess(true);
      setTimeout(() => {
        setFeedbackText("");
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xl transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 bg-clip-text text-transparent">
            Phản hồi của bạn về EngAce
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <textarea
            value={feedbackText}
            onChange={handleTextChange}
            placeholder={feedbackPlaceholder}
            className={`w-full h-80 sm:h-70 p-3 sm:p-4 mb-1 rounded-lg border ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-200 dark:border-slate-700 focus:ring-blue-500"
            } bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 transition-all text-sm sm:text-base`}
          />
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <div className="text-slate-500 dark:text-slate-400">
              {charCount}/500 ký tự
            </div>
            {error && (
              <div className="flex items-center text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
                  className="bg-slate-500/20 backdrop-blur-sm border border-slate-200/50 text-slate-700 hover:bg-slate-500/40 dark:bg-slate-700/50 dark:border-slate-600/50 dark:text-slate-300 dark:hover:bg-slate-600/80 cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={feedbackText.trim().length < 10 || isSubmitting}
              className={`w-full sm:w-auto ${
                feedbackText.trim().length < 10
                  ? "bg-slate-300 cursor-not-allowed dark:bg-slate-700"
                  : showSuccess
                  ? "bg-gradient-to-r from-green-700 to-green-600"
                  : "bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 hover:from-blue-600 hover:to-purple-600"
              } text-white transition-colors disabled:opacity-70`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã gửi</span>
                </>
              ) : (
                <span>Gửi phản hồi</span>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
