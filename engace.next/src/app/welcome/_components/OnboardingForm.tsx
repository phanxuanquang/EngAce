"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { UserCircle2, VenusAndMars, CalendarRange, Key, Eye, EyeOff, ExternalLink, HelpCircle, Link, ChevronRight, ChevronsRight } from "lucide-react"
import { ArrowRight } from "lucide-react"
import AiButton from "@/components/system/button/ai-button"
import { API_DOMAIN } from "@/lib/config"
import { toast } from "sonner"
import WelcomeHeader from "./WelcomeHeader"
import TermsAndConditions from "./TermsAndConditions"
import { InputGroup, SelectGroup } from "@/components/form"

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
      <InputGroup
        id="fullName"
        label="Họ và tên"
        placeholder="Nhập họ và tên của bạn"
        icon={UserCircle2}
        disabled={isLoading}
        register={register}
        error={errors.fullName?.message}
      />

      {/* Gender Select */}
      <SelectGroup
        label="Giới tính"
        placeholder="Chọn giới tính của bạn"
        icon={VenusAndMars}
        options={[
          { value: "male", label: "Nam" },
          { value: "female", label: "Nữ" },
          { value: "other", label: "Khác" },
        ]}
        disabled={isLoading}
        onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}
        error={errors.gender?.message}
        register={register("gender")}
      />

      {/* Age Input */}
      <InputGroup
        id="age"
        label="Tuổi"
        placeholder="Nhập tuổi của bạn"
        icon={CalendarRange}
        type="number"
        disabled={isLoading}
        register={register}
        registerOptions={{ 
          valueAsNumber: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
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
        }}
        error={errors.age?.message}
      />

      {/* API Key Input */}
      <InputGroup
        id="geminiApiKey"
        label="Gemini API Key"
        placeholder="Nhập Gemini API key của bạn"
        icon={Key}
        type={showApiKey ? "text" : "password"}
        disabled={isLoading}
        register={register}
        error={errors.geminiApiKey?.message}
        rightElement={
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            disabled={isLoading}
          >
            {showApiKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        }
        extraComponent={
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <HelpCircle className="h-3 w-3" />
            <span>Bạn có thể lấy API Key từ </span>
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
        }
      />

      <AiButton loading={isLoading} type="submit"
        disabled={isLoading} className="w-full" icon={ChevronsRight}>
        Tiếp tục
      </AiButton>
    </form>
    <TermsAndConditions />
    </>
  );
} 