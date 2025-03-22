"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { FeatureSection } from "@/components/feature-section";

import { GENDER_OPTIONS, CEFR_OPTIONS } from "@/constants/options";
import { validateGeminiApiKey } from "@/services/api-validation";
import { LocalStorageService } from "@/services/local-storage";
import type { RegistrationForm as RegistrationFormType } from "@/types/form";
import { registrationSchema } from "@/types/form";

export function RegistrationFormComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegistrationFormType>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      age: undefined,
      gender: undefined,
      acceptTerms: false,
      geminiApiKey: "",
      englishLevel: undefined,
    },
  });

  const onSubmit = async (data: RegistrationFormType) => {
    setIsLoading(true);
    try {
      const validation = await validateGeminiApiKey(data.geminiApiKey);
      if (!validation.success) {
        form.setError("geminiApiKey", {
          type: "manual",
          message: validation.error,
        });
        return;
      }
      // Save user data using the LocalStorageService
      LocalStorageService.setItem("formData", "registration", data);
      router.push("/home");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedLevel, setSelectedLevel] = useState<number | undefined>();

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Feature Section */}
      <div className="hidden lg:block w-1/2 h-screen overflow-hidden">
        <FeatureSection className="h-full" />
      </div>

      {/* Right Side - Registration Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 max-w-xl mx-auto p-4 flex flex-col justify-center"
      >
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
           className="text-center"
        >
         <div className="z-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold items-center flex flex-col mb-8 md:mb-12">
          <span
            className="font-bold items-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 
            animate-glow drop-shadow-[0_0_35px_rgba(191,219,254,0.5)]
            hover:drop-shadow-[0_0_45px_rgba(191,219,254,0.8)] transition-all duration-300"
          >
            ENGACE
          </span>
        </div>
      </motion.div>
      <BackgroundGradient
        containerClassName="w-full"
        className="p-6 rounded-[22px] backdrop-blur-lg bg-white dark:bg-zinc-900"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">
                    Họ và tên
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Tuổi</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={6}
                      max={70}
                      placeholder="Nhập tuổi của bạn"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm md:text-base">
                    Giới tính
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn giới tính của bạn" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="geminiApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">
                    Gemini API Key
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập API key của bạn"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs md:text-xs">
                    Bạn có thể lấy API Key từ{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline"
                    >
                      Google AI Studio
                    </a>
                    .
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="englishLevel"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm md:text-base">
                    Trình độ tiếng Anh (CEFR)
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const numValue = parseInt(value);
                      field.onChange(numValue);
                      setSelectedLevel(numValue);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trình độ của bạn" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CEFR_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedLevel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="bg-primary/5 p-2.5 rounded-xl"
                    >
                      <FormDescription className="text-xs md:text-sm">
                        {
                          CEFR_OPTIONS.find((o) => o.value === selectedLevel)
                            ?.description
                        }
                      </FormDescription>
                    </motion.div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <p className="text-sm">
                      Tôi đồng ý với{" "}
                      <a
                        href="https://ai.google.dev/gemini-api/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-semibold hover:underline"
                      >
                        Điều khoản dịch vụ của Gemini
                      </a>
                      .
                    </p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2"
                >
                  <motion.div
                    className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span>Đang xác thực...</span>
                </motion.div>
              ) : (
                "Bắt đầu"
              )}
            </Button>
          </form>
        </Form>
      </BackgroundGradient>
      </motion.div>
    </div>
  );
}
