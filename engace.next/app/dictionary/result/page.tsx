"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Copy, Sparkles, CheckCircle2, Search } from "lucide-react";
import { API_DOMAIN } from "@/lib/config";
import { getUserPreferences } from "@/lib/localStorage";
import Navbar from "@/components/Navbar";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const isBrowser = typeof window !== "undefined";

function DictionaryResultContent() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const context = searchParams.get("context");

  useEffect(() => {
    if (!isBrowser) return;

    const preferences = getUserPreferences();
    if (!preferences.hasCompletedOnboarding) {
      router.push("/");
      return;
    }

    if (!keyword) {
      router.push("/dictionary");
      return;
    }

    const fetchResult = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const preferences = getUserPreferences();
        if (!preferences.geminiApiKey) {
          throw new Error(
            "API key not found. Please complete the onboarding process."
          );
        }

        // Construct search URL with parameters
        const searchUrl = new URL(`${API_DOMAIN}/api/Dictionary/Search`);
        searchUrl.searchParams.append("keyword", keyword);
        if (context) {
          searchUrl.searchParams.append("context", context);
        }

        const response = await fetch(searchUrl.toString(), {
          method: "GET",
          headers: {
            accept: "text/plain",
            Authentication: preferences.geminiApiKey,
          },
        });

        if (!response.ok) {
          throw new Error(
            (await response.text()) || "Failed to fetch dictionary results"
          );
        }

        const data = await response.text();
        setResult(data);
      } catch (err) {
        console.error("Search error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while searching"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [keyword, context, router]);

  const handleCopy = () => {
    if (!isBrowser || !result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-purple-400 to-blue-600">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-400 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-400 blur-3xl opacity-30"></div>
      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 rounded-lg bg-white/80 px-4 py-2 text-slate-600 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Quay lại</span>
            </button>

            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 rounded-lg bg-white/80 px-4 py-2 text-slate-600 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-green-500">Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Result Content */}
          <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-slate-800/80">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-25"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Đang tra cứu...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <p className="text-center text-red-500 dark:text-red-400">
                  {error}
                </p>
                <button
                  onClick={() => router.back()}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                >
                  Thử lại
                </button>
              </div>
            ) : result ? (
              <div className="animate-fadeIn">
                <MarkdownRenderer>{result}</MarkdownRenderer>
              </div>
            ) : (
              <div className="text-center text-slate-600 dark:text-slate-400">
                Không tìm thấy kết quả cho từ khóa này.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DictionaryResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-25"></div>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    }>
      <DictionaryResultContent />
    </Suspense>
  );
}
