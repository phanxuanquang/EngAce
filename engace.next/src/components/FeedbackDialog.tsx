"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_DOMAIN } from "@/lib/config";
import { Loader2, X, AlertCircle, CheckCircle2 } from "lucide-react";

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-0"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="w-full max-w-xl transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Phản hồi của bạn về EngAce
              </h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4">
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
              <div className="flex justify-between items-center text-xs sm:text-sm mb-4">
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

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2 mt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm sm:text-base"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={feedbackText.trim().length < 10 || isSubmitting}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 ${
                  feedbackText.trim().length < 10
                    ? "bg-slate-300 cursor-not-allowed dark:bg-slate-700"
                    : showSuccess
                    ? "bg-gradient-to-r from-green-700 to-green-600"
                    : "bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
                } text-white transition-colors text-sm sm:text-base disabled:opacity-70`}
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
                  <span>Gửi</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
