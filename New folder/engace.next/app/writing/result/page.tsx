"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Copy, Sparkles, CheckCircle2 } from "lucide-react"
import MarkdownRenderer from "@/components/MarkdownRenderer";
import remarkGfm from "remark-gfm"
import { getUserPreferences } from "@/lib/localStorage"
import Navbar from "@/components/Navbar"

const isBrowser = typeof window !== 'undefined'

type MarkdownProps = {
  children: string
}

export default function WritingResultPage() {
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const title = searchParams.get("title")
  const content = searchParams.get("content")

  useEffect(() => {
    if (!isBrowser) return

    const preferences = getUserPreferences()
    if (!preferences.hasCompletedOnboarding) {
      router.push("/")
      return
    }

    if (!title || !content) {
      router.push("/writing")
      return
    }

    const analyzeWriting = async () => {
      setIsLoading(true)
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const sampleResult = `# Phân tích bài viết

## Tổng quan
- **Chủ đề**: ${title}
- **Độ dài**: ${content.length} ký tự
- **Đánh giá chung**: Bài viết có cấu trúc rõ ràng và mạch lạc

## Chi tiết đánh giá

### 1. Ưu điểm
- Cấu trúc bài viết logic
- Sử dụng từ vựng đa dạng
- Ý tưởng được trình bày rõ ràng

### 2. Điểm cần cải thiện
- Một số câu dài và phức tạp
- Cần thêm ví dụ minh họa
- Một số lỗi ngữ pháp nhỏ

### 3. Gợi ý chỉnh sửa

#### Ngữ pháp
1. "..." → "..."
2. "..." → "..."

#### Từ vựng
- Thay "..." bằng "..."
- Bổ sung từ đồng nghĩa cho "..."

## Bản sửa gợi ý

\`\`\`diff
+ Phiên bản đề xuất
- Phiên bản gốc
\`\`\`

## Kết luận
Bài viết của bạn thể hiện sự hiểu biết tốt về chủ đề. Với một số điều chỉnh nhỏ, bài viết sẽ trở nên hoàn thiện hơn.`

      setResult(sampleResult)
      setIsLoading(false)
    }

    analyzeWriting()
  }, [title, content, router])

  const handleCopy = () => {
    if (!isBrowser || !result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-purple-400 to-blue-600">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-400 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-400 blur-3xl opacity-30"></div>
      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-8">
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
          <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-slate-800/80">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4 py-12">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-25"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Đang phân tích bài viết của bạn...
                </p>
              </div>
            ) : result ? (
              <div className="prose-pre:bg-slate-100 prose-pre:dark:bg-slate-700">
                <MarkdownRenderer>{result}</MarkdownRenderer>
              </div>
            ) : (
              <div className="text-center text-slate-600 dark:text-slate-400">
                Không thể tải kết quả. Vui lòng thử lại.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}