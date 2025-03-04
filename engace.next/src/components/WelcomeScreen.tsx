"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff, ExternalLink, HelpCircle,  ConciergeBell, ArrowRight, UserCircle2, VenusAndMars, CalendarRange, Moon, Sun } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_DOMAIN } from "@/lib/config";
import ProficiencyForm from "@/components/ProficiencyForm";
import AiButton from "./system/button/ai-button";
import Image from "next/image";
import { SparklesText } from "./system/text/sparkles-text";
import { Ripple } from "./system/background/ripple-background";
import { useTheme } from "@/contexts/ThemeContext";
import {  toast } from "sonner";

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

export default function WelcomeScreen() {
  const { isDark, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData | null>(null);
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
      setFormData(data);
      setCurrentStep(2);
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "API key validation failed. Please check your key and try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 2 && formData) {
    return <ProficiencyForm formData={formData} />;
  }

  return (
    <>
      {/* Theme Toggle - Fixed Position */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors z-50 cursor-pointer"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        ) : (
          <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        )}
      </button>

      <div className="container relative min-h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Hero section */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex overflow-hidden">
          <Image
            src="/images/start.jpeg"
            alt="English learning background"
            fill
            className="absolute inset-0 object-cover brightness-[0.7] opacity-90"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 via-purple-500/60 to-blue-500/10" />
          
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center">
            <SparklesText firstColor="#F8E7F6" secondColor="#A1E3F9">
              <span className="text-6xl font-black bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent">ENGACE</span>
            </SparklesText>
            <p className="text-md text-white/90 max-w-md">
              Học tiếng Anh thông minh cùng AI
            </p>
          </div>
          <Ripple />
        </div>

        {/* Right side - Form section */}
        <div className="relative flex h-screen flex-col items-center justify-center lg:p-8">
        
         

          <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px] md:px-0">
              {/* Mobile Logo */}
          <div className="flex items-center justify-center text-lg font-medium lg:hidden">
            <SparklesText firstColor="#F8E7F6" secondColor="#A1E3F9">
              <span className="text-5xl font-black bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 bg-clip-text text-transparent">ENGACE</span>
            </SparklesText>
          </div>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight mt-16 lg:mt-0">
                CHÀO MỪNG
              </h1>
              <p className="text-sm text-muted-foreground">
                EngAce muốn biết một số thông tin cơ bản để hỗ trợ bạn học tập tốt nhất
              </p>
            </div>

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
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <AiButton loading={isLoading} type="submit"
                disabled={isLoading} className="w-full" icon={ArrowRight}>
                Tiếp tục
              </AiButton>
            </form>

            <p className="px-4 text-center text-sm text-muted-foreground sm:px-8">
              Bằng cách tiếp tục, bạn đồng ý với{" "}<br/>
              <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Chính sách bảo mật
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
