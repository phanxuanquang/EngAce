"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PenLine, Loader2, Upload } from "lucide-react";
import { getUserPreferences } from "@/lib/localStorage";
import { Button } from "@/components/ui/button";
import { API_DOMAIN } from "@/lib/config";
import Navbar from "@/components/Navbar";

const VISITED_KEY = "has-visited-writing";
const isBrowser = typeof window !== "undefined";

export default function WritingPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const router = useRouter();
  const preferences = getUserPreferences();

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.push("/");
      return;
    }

    if (isBrowser) {
      const hasVisited = localStorage.getItem(VISITED_KEY);
      if (!hasVisited) {
        setShowGuide(true);
        localStorage.setItem(VISITED_KEY, "true");
      }
    }
  }, [router, preferences.hasCompletedOnboarding]);

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const searchParams = new URLSearchParams();
    searchParams.set("title", title.trim());
    searchParams.set("content", content.trim());
    router.push(`/writing/result?${searchParams.toString()}`);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsExtracting(true);
      const base64 = await convertToBase64(file);

      const response = await fetch(
        `${API_DOMAIN}/api/Healthcheck/ExtractTextFromImage`,
        {
          method: "POST",
          headers: {
            accept: "text/plain",
            Authentication: preferences.geminiApiKey || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(base64),
        }
      );

      const extractedText = await response.text();
      setContent(extractedText);
    } catch (error) {
      console.error("Error extracting text:", error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-purple-400 to-blue-600">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-400 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-400 blur-3xl opacity-30"></div>
      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 dark:shadow-green-900/25">
              <PenLine className="h-10 w-10" />
            </div>
            <h1 className="mb-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-4xl font-bold text-transparent">
              LUYỆN VIẾT
            </h1>
            <p className="mx-auto max-w-xl text-slate-600 dark:text-slate-400 text-sm">
              Nhận phản hồi chi tiết để nâng cao kỹ năng viết tiếng Anh của bạn.
            </p>
          </div>

          {/* Writing Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Section */}
            <div className="group rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-xl dark:bg-slate-800/80 dark:hover:bg-slate-800">
              <label className="block space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900 dark:text-white">
                    Đề bài
                  </span>
                </div>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập đề bài hoặc yêu cầu bạn cần viết..."
                  rows={3}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-green-400 dark:focus:ring-green-400/10"
                  required
                />
              </label>
            </div>

            {/* Content Section */}
            <div className="group rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-xl dark:bg-slate-800/80 dark:hover:bg-slate-800">
              <label className="block space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900 dark:text-white">
                    Bài viết của bạn
                  </span>
                  <div className="relative">
                    <input
                      type="file"
                      id="imageUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isExtracting}
                    />
                    <Button
                      variant="outline"
                      className="text-sm bg-slate-600/10 text-slate-900 dark:bg-slate-500/50 dark:text-white"
                      size="sm"
                      onClick={() =>
                        document.getElementById("imageUpload")?.click()
                      }
                      disabled={isExtracting}
                    >
                      {isExtracting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang trích xuất
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Nhập từ ảnh
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập nội dung bài viết của bạn ở đây..."
                    rows={10}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-green-400 dark:focus:ring-green-400/10"
                    required
                  />
                  <div className="absolute bottom-4 right-4 text-sm text-slate-400 dark:text-slate-500">
                    {charCount} ký tự
                  </div>
                </div>
              </label>
              <label className="text-xs italic opacity-70">EngAce vẫn có thể mắc sai sót. Bạn nên tự kiểm chứng lại kết quả nha.</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className={`group relative w-full transform overflow-hidden rounded-xl px-6 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 ${
                isSubmitting || !title.trim() || !content.trim()
                  ? "cursor-not-allowed bg-slate-500"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-500/25 hover:translate-y-[-2px] hover:shadow-xl dark:shadow-green-900/25"
              }`}
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <span>Nộp bài</span>
              </div>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-green-700 to-emerald-700 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </form>
        </div>
      </div>

      {/* First Visit Guide */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-lg transform rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
            <div className="mb-6">
              <h2 className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
                Luyện viết thông minh
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>Tính năng Luyện viết thông minh của EngAce giúp bạn:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Nhận phản hồi chi tiết về bài viết của bạn</li>
                  <li>Phát hiện lỗi ngữ pháp và cách diễn đạt</li>
                  <li>Gợi ý cải thiện để nâng cao chất lượng bài viết</li>
                  <li>Phân tích cấu trúc và tính mạch lạc của bài viết</li>
                </ul>
                <p className="font-medium mt-4">Để bắt đầu:</p>
                <ul className="list-decimal ml-6 space-y-2">
                  <li>Nhập đề bài hoặc yêu cầu cần viết</li>
                  <li>Nhập nội dung bài viết của bạn</li>
                  <li>Nộp bài để xem phân tích chi tiết</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-white transition-all duration-200 hover:shadow-lg"
            >
              <div className="relative z-10">Bắt đầu viết</div>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-green-700 to-emerald-700 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
