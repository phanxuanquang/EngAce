"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { API_DOMAIN } from "@/lib/config"
import ProficiencyForm from "@/components/ProficiencyForm"

const formSchema = z.object({
  fullName: z.string().min(2, "Tên không hợp lệ"),
  gender: z.enum(["male", "female", "other"]),
  age: z
    .number()
    .min(7, "Người dùng phải từ 7 tuổi trở lên")
    .max(60, "Người dùng phải dưới 60 tuổi"),
  geminiApiKey: z.string().min(1, "Vui lòng nhập API key"),
})

type FormData = z.infer<typeof formSchema>

export default function OnboardingForm() {
  const [error, setError] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      gender: "other",
      age: undefined,
      geminiApiKey: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError("")

      // Health check API call
      const response = await fetch(`${API_DOMAIN}/api/Healthcheck`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authentication': data.geminiApiKey
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Health check failed')
      }

      // If health check succeeds, proceed
      setFormData(data)
      setCurrentStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : "API key validation failed. Please check your key and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (currentStep === 2 && formData) {
    return <ProficiencyForm formData={formData} />
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-purple-400 to-blue-600">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-400 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-400 blur-3xl opacity-30"></div>
      
      {/* Glass card */}
      <div className="relative w-full max-w-md p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] bg-white/10 backdrop-blur-lg border border-white/20 transition-transform duration-300 hover:scale-[1.01]">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              CHÀO MỪNG
            </h1>
            <p className="text-white/80">
              EngAce muốn biết một số thông tin cơ bản để hỗ trợ bạn tốt nhất nha!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Tên của bạn là
              </label>
              <Input
                {...register("fullName")}
                placeholder="A dễ thương"
                className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm transition-colors focus:bg-white/20"
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-sm text-red-300">{errors.fullName.message}</p>
              )}
            </div>

            {/* Gender Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Giới tính của bạn là
              </label>
              <Select
                onValueChange={(value) =>
                  setValue("gender", value as "male" | "female" | "other")
                }
                defaultValue="other"
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm transition-colors focus:bg-white/20">
                  <SelectValue placeholder="Nam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Tuổi của bạn là
              </label>
              <Input
                {...register("age", { valueAsNumber: true })}
                type="number"
                placeholder="16"
                min={7}
                max={60}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm transition-colors focus:bg-white/20"
                disabled={isLoading}
              />
              {errors.age && (
                <p className="text-sm text-red-300">{errors.age.message}</p>
              )}
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Gemini API Key
              </label>
              <Input
                {...register("geminiApiKey")}
                type="password"
                placeholder="Enter your Gemini API key"
                className="bg-white/10 border
                0 text-white placeholder-white/50 backdrop-blur-sm transition-colors focus:bg-white/20"
                disabled={isLoading}
              />
              {errors.geminiApiKey && (
                <p className="text-sm text-red-300">
                  {errors.geminiApiKey.message}
                </p>
              )}
              <p className="text-sm text-white/70">
                Bạn có thể lấy API từ{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-blue-100 underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            {error && (
              <div className="animate-fadeIn rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-sm text-red-300 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] focus:scale-[0.98] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <span>Tiếp tục</span>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-200 group-hover:translate-x-0 -translate-x-full"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
