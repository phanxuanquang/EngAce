"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveUserPreferences } from "@/lib/localStorage"
import { PROFICIENCY_LEVELS } from "@/lib/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ProficiencyFormProps = {
  formData: {
    fullName: string
    gender: string
    age: number
    geminiApiKey: string
  }
}

export default function ProficiencyForm({ formData }: ProficiencyFormProps) {
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLevel) {
      setError("Vui lòng chọn trình độ của bạn")
      return
    }

    try {
      saveUserPreferences({
        ...formData,
        proficiencyLevel: selectedLevel,
        hasCompletedOnboarding: true,
      })
      router.push("/dashboard")
    } catch {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.")
    }
  }

  const handleLevelChange = (value: string) => {
    const level = parseInt(value, 10)
    setSelectedLevel(level)
    setError("")
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-purple-800 to-blue-600">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-400 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-400 blur-3xl opacity-30"></div>

      {/* Glass card */}
      <div className="relative w-full max-w-md p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-lg border border-white/20 transition-transform duration-300">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl py-2 font-bold text-slate bg-clip-text bg-gradient-to-r from-white to-blue-100">
              TRÌNH ĐỘ TIẾNG ANH
            </h1>
            <p className="text-slate-800/80 text-sm dark:text-white/60">
              Chọn trình độ phù hợp với bạn để EngAce có thể cung cấp nội dung học tập phù hợp nhất.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Level Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate/90">
                Trình độ của bạn
              </label>
              <Select onValueChange={handleLevelChange}>
                <SelectTrigger className="bg-slate/10 border-slate/20 bg-slate-400/10 text-slate backdrop-blur-sm transition-colors focus:bg-slate/20">
                  <SelectValue placeholder="Chọn trình độ của bạn" />
                </SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_LEVELS.map((level) => (
                    <SelectItem
                      key={level.id}
                      value={String(level.id)}
                      className="focus:bg-blue-500/20"
                    >
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            {selectedLevel && (
              <div className="animate-fadeIn rounded-xl bg-slate/5 p-4 backdrop-blur-sm border border-slate/10 bg-slate-400/10">
                <p className="text-sm text-slate/90">
                  {PROFICIENCY_LEVELS.find((l) => l.id === selectedLevel)?.description}
                </p>
              </div>
            )}

            {error && (
              <div className="animate-fadeIn rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-sm text-red-300 text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] focus:scale-[0.98] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="relative z-10">Xác nhận và bắt đầu</div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-200 group-hover:translate-x-0 -translate-x-full"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
