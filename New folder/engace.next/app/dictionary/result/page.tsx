"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Volume2, Copy, BookOpen } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getUserPreferences } from "@/lib/localStorage"
import Navbar from "@/components/Navbar"

type SearchResult = {
  content: string
  timestamp: Date
}

type MarkdownProps = {
  children: string
}

const MarkdownRenderer = ({ children }: MarkdownProps) => (
  <div className="prose max-w-none dark:prose-invert prose-headings:border-b prose-headings:border-slate-200 dark:prose-headings:border-slate-700">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  </div>
)

export default function ResultPage() {
  const [result, setResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const keyword = searchParams.get("keyword")
  const context = searchParams.get("context")

  useEffect(() => {
    if (!keyword) {
      router.push("/dictionary")
      return
    }

    const fetchResult = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setResult({
        content: `# ${keyword}

## Định nghĩa

1. **Nghĩa chính**: Example definition in Vietnamese
2. **Nghĩa phụ**: Secondary meaning in Vietnamese

## Ví dụ

1. "*Here's an example sentence using the word*"
   - Đây là câu ví dụ sử dụng từ này

2. "*Another example in a different context*"
   - Một ví dụ khác trong ngữ cảnh khác

## Thành ngữ/Cụm từ liên quan

- **${keyword} out**: Meaning of phrasal verb
- **${keyword} up**: Another phrasal verb meaning

## Ghi chú

- Cách phát âm: /example/
- Loại từ: Danh từ, Động từ
- Mức độ phổ biến: Thường xuyên được sử dụng`,
        timestamp: new Date(),
      })
      setIsLoading(false)
    }

    fetchResult()
  }, [keyword, router])

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.content)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Quay lại</span>
            </button>

            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Sao chép</span>
              </button>
            )}
          </div>

          {/* Search Summary */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {keyword}
                </h1>
                {context && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Ngữ cảnh: {context}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="mx-auto max-w-3xl">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-white p-8 text-center shadow-lg dark:bg-slate-800">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-slate-600 dark:text-slate-400">Đang tải kết quả...</p>
            </div>
          ) : result ? (
            <div className="animate-fadeIn rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
              <MarkdownRenderer>{result.content}</MarkdownRenderer>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 text-center shadow-lg dark:bg-slate-800">
              <p className="text-slate-600 dark:text-slate-400">
                Không tìm thấy kết quả cho từ khóa này
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}