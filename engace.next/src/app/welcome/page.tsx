"use client";

import { useState } from "react";
import { Moon, Sun, ArrowLeft } from "lucide-react";

import { SparklesText } from "@/components/system/text/sparkles-text";
import { Ripple } from "@/components/system/background/ripple-background";
import { useTheme } from "@/contexts/ThemeContext";
import ProficiencyForm from "./_components/ProficiencyForm";
import Image from "next/image";
import OnboardingForm from "./_components/OnboardingForm";

type FormData = {
  fullName: string;
  gender: "male" | "female" | "other";
  age: number;
  geminiApiKey: string;
};

export default function WelcomeScreen() {
  const { isDark, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData | null>(null);

  const renderForm = () => {
    if (currentStep === 2 && formData) {
      return <ProficiencyForm formData={formData} onBack={() => setCurrentStep(1)} />;
    }

    return (
        <OnboardingForm 
          onSuccess={(data) => {
            setFormData(data);
            setCurrentStep(2);
          }} 
        />
    );
  };

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
          {currentStep === 2 && (
            <button
              onClick={() => setCurrentStep(1)}
              className="absolute top-8 left-8 flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Trở lại</span>
            </button>
          )}
          {/* Mobile Logo */}
          <div className="flex items-center justify-center text-lg font-medium lg:hidden mb-8">
            <SparklesText firstColor="#F8E7F6" secondColor="#A1E3F9">
              <span className="text-5xl font-black bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 bg-clip-text text-transparent">ENGACE</span>
            </SparklesText>
          </div>

          <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px] md:px-0">
            {renderForm()}
          </div>
        </div>
      </div>
    </>
  );
}
