"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Copy, Sparkles, CheckCircle2 } from "lucide-react"
import { API_DOMAIN } from "@/lib/config"
import { getUserPreferences } from "@/lib/localStorage"
import Navbar from "@/components/Navbar"
import MarkdownRenderer from "@/components/MarkdownRenderer"

interface ReviewRequest {
  Requirement: string
  Content: string
  UserLevel: number
}

const isBrowser = typeof window !== 'undefined'

function WritingResultContent() {
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

    const generateReview = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const preferences = getUserPreferences()
        if (!preferences.geminiApiKey) {
          throw new Error('API key not found. Please complete the onboarding process.')
        }

        // Prepare review request
        const reviewRequest: ReviewRequest = {
          Requirement: title,
          Content: content,
          UserLevel: preferences.proficiencyLevel || 1
        }

        const response = await fetch(`${API_DOMAIN}/api/Review/Generate`, {
          method: 'POST',
          headers: {
            'accept': 'text/plain',
            'Authentication': preferences.geminiApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reviewRequest)
        })

        if (!response.ok) {
          throw new Error(await response.text() || 'Failed to generate review')
        }

        const data = await response.text()
        setResult(data)
      } catch (err) {
        console.error('Review generation error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while generating review')
      } finally {
        setIsLoading(false)
      }
    }

    generateReview()
  }, [title, content, router])

  const handleCopy = () => {
    if (!isBrowser || !result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
          <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-slate-800/80">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-25"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Đang phân tích bài viết của bạn...
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
                Không thể tạo đánh giá cho bài viết này.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WritingResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-25"></div>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    }>
      <WritingResultContent />
    </Suspense>
  )
}