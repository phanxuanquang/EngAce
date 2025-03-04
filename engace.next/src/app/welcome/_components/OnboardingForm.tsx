"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserCircle2, VenusAndMars, CalendarRange, Key, Eye, EyeOff, ExternalLink, HelpCircle, Link, ChevronRight, ChevronsRight } from "lucide-react"
import { ArrowRight } from "lucide-react"
import AiButton from "@/components/system/button/ai-button"
import { API_DOMAIN } from "@/lib/config"
import { toast } from "sonner"
import WelcomeHeader from "./WelcomeHeader"
import TermsAndConditions from "./TermsAndConditions"

const formSchema = z.object({
  fullName: z.string().min(2, "Tên không hợp lệ"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  age: z
    .number({
      required_error: "Vui lòng nhập tuổi",
      invalid_type_error: "Tuổi phải là số",
    })
    .int("Tuổi phải là số nguyên")
    .positive("Tuổi phải là số dương")
    .min(7, "Người dùng phải từ 7 tuổi trở lên")
    .max(60, "Người dùng phải dưới 60 tuổi"),
  geminiApiKey: z
    .string()
    .min(39, "API key không hợp lệ")
    .regex(/^AIza/, "API key phải bắt đầu bằng 'AIza'"),
});

type FormData = z.infer<typeof formSchema>;

type OnboardingFormProps = {
  onSuccess: (data: FormData) => void;
}

export default function OnboardingForm({ onSuccess }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      gender: undefined,
      age: undefined,
      geminiApiKey: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // Health check API call
      const response = await fetch(`${API_DOMAIN}/api/Healthcheck`, {
        method: "GET",
        headers: {
          accept: "text/plain",
          Authentication: data.geminiApiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Health check failed");
      }

      // If health check succeeds, proceed
      onSuccess(data);
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "API key validation failed. Please check your key and try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
     <WelcomeHeader />
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Input */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Họ và tên</Label>
        <div className="relative">
          <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            {...register("fullName")}
            id="fullName"
            autoComplete="off"
            placeholder="Nhập họ và tên của bạn"
            className="pl-10 focus-visible:ring-0"
            disabled={isLoading}
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      {/* Gender Select */}
      <div className="space-y-2">
        <Label>Giới tính</Label>
        <div className="relative">
          <VenusAndMars className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Select
            onValueChange={(value) =>
              setValue("gender", value as "male" | "female" | "other")
            }
            disabled={isLoading}
            {...register("gender")}
          >
            <SelectTrigger className="pl-10 focus-visible:ring-0">
              <SelectValue placeholder="Chọn giới tính của bạn" />
            </SelectTrigger>
            <SelectContent className="focus-visible:ring-0">
              <SelectItem value="male" className="focus-visible:ring-0">Nam</SelectItem>
              <SelectItem value="female" className="focus-visible:ring-0">Nữ</SelectItem>
              <SelectItem value="other" className="focus-visible:ring-0">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.gender && (
          <p className="text-sm text-destructive">{errors.gender.message}</p>
        )}
      </div>

      {/* Age Input */}
      <div className="space-y-2">
        <Label>Tuổi</Label>
        <div className="relative">
          <CalendarRange className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            {...register("age", { 
              valueAsNumber: true,
              onChange: (e) => {
                const value = e.target.value;
                if (value === "") {
                  setValue("age", null as any);
                } else {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue)) {
                    setValue("age", numValue);
                  }
                }
              }
            })}
            autoComplete="off"
            type="number"
            placeholder="Nhập tuổi của bạn"
            className="pl-10 focus-visible:ring-0"
            min={7}
            max={60}
            disabled={isLoading}
          />
        </div>
        {errors.age && (
          <p className="text-sm text-destructive">{errors.age.message}</p>
        )}
      </div>

      {/* API Key Input */}
      <div className="space-y-2">
        <Label>Gemini API Key</Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            {...register("geminiApiKey")}
            autoComplete="off"
            type={showApiKey ? "text" : "password"}
            placeholder="Nhập Gemini API key của bạn"
            className="pl-10 pr-10 focus-visible:ring-0"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            disabled={isLoading}
          >
            {showApiKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.geminiApiKey && (
          <p className="text-sm text-destructive">{errors.geminiApiKey.message}</p>
        )}
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <HelpCircle className="h-3 w-3" />
          Bạn có thể lấy API Key từ{" "}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline font-semibold hover:text-blue-600 inline-flex items-center gap-1"
          >
            Google AI Studio
            <Link className="h-3 w-3" />
          </a>
        </div>
      </div>

      <AiButton loading={isLoading} type="submit"
        disabled={isLoading} className="w-full" icon={ChevronsRight}>
        Tiếp tục
      </AiButton>
    </form>
    <TermsAndConditions />
    </>
  );
} 