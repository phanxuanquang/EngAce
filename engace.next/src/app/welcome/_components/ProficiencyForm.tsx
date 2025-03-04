"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveUserPreferences } from "@/lib/localStorage"
import { PROFICIENCY_LEVELS } from "@/lib/constants"
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react"
import AiButton from "@/components/system/button/ai-button"
import { toast } from "sonner"
import { SelectGroup } from "@/components/app/form"

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLevel) {
      toast.error("Vui lòng chọn trình độ của bạn")
      return
    }

    try {
      saveUserPreferences({
        ...formData,
        proficiencyLevel: selectedLevel,
        hasCompletedOnboarding: true,
      })
      toast.success("Đã lưu thông tin thành công!")
      router.push("/dashboard")
    } catch {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.")
    }
  }

  const handleLevelChange = (value: string) => {
    const level = parseInt(value, 10)
    setSelectedLevel(level)
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
        <SelectGroup
          label="Trình độ của bạn"
          placeholder="Chọn trình độ của bạn"
          icon={GraduationCap}
          options={PROFICIENCY_LEVELS.map(level => ({
            value: String(level.id),
            label: level.name
          }))}
          onValueChange={handleLevelChange}
        />

        {/* Description */}
        {selectedLevel && (
          <div className="animate-fadeIn rounded-lg bg-slate-100 dark:bg-slate-800 p-4">
            <p className="text-sm text-muted-foreground">
              {PROFICIENCY_LEVELS.find((l) => l.id === selectedLevel)?.description}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <AiButton type="submit" className="w-full" icon={Sparkles}>
          Xác nhận và bắt đầu
        </AiButton>
      </form>
    </div>
  )
}
