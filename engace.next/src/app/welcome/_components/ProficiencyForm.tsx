"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveUserPreferences } from "@/lib/localStorage"
import { PROFICIENCY_LEVELS } from "@/lib/constants"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GraduationCap, ArrowRight } from "lucide-react"
import AiButton from "@/components/system/button/ai-button"

type ProficiencyFormProps = {
  formData: {
    fullName: string
    gender: string
    age: number
    geminiApiKey: string
  }
  onBack: () => void
}

export default function ProficiencyForm({ formData, onBack }: ProficiencyFormProps) {
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
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px] md:px-0">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          TRÌNH ĐỘ TIẾNG ANH
        </h1>
        <p className="text-sm text-muted-foreground">
          Chọn trình độ phù hợp với bạn để EngAce có thể cung cấp nội dung học tập phù hợp nhất
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Level Selection */}
        <div className="space-y-2">
          <Label>
            Trình độ của bạn
          </Label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Select onValueChange={handleLevelChange}>
              <SelectTrigger className="pl-10 focus-visible:ring-0">
                <SelectValue placeholder="Chọn trình độ của bạn" />
              </SelectTrigger>
              <SelectContent className="focus-visible:ring-0">
                {PROFICIENCY_LEVELS.map((level) => (
                  <SelectItem
                    key={level.id}
                    value={String(level.id)}
                    className="focus-visible:ring-0"
                  >
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        {selectedLevel && (
          <div className="animate-fadeIn rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
            <p className="text-sm text-muted-foreground">
              {PROFICIENCY_LEVELS.find((l) => l.id === selectedLevel)?.description}
            </p>
          </div>
        )}

        {error && (
          <div className="animate-fadeIn rounded-lg bg-destructive/10 border border-destructive/20 p-3">
            <p className="text-sm text-destructive text-center">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <AiButton type="submit" className="w-full" icon={ArrowRight}>
          Xác nhận và bắt đầu
        </AiButton>
      </form>
    </div>
  )
}
