"use client";

import { useState, useEffect } from "react";
import { UserRound, Key, Loader2, AlertCircle, Eye, EyeOff, GraduationCap, UserCircle, CalendarRange, VenusAndMars, HelpCircle, ExternalLink, Link } from "lucide-react";
import { PROFICIENCY_LEVELS } from "@/lib/constants";
import { getUserPreferences, saveUserPreferences } from "@/lib/localStorage";
import { API_DOMAIN } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InputGroup, SelectGroup } from "@/components/form";
import { useForm } from "react-hook-form";

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  age: string;
  gender: string;
  geminiApiKey: string;
  proficiencyLevel: string;
}

export default function UserProfileDialog({
  isOpen,
  onClose,
}: UserProfileDialogProps) {
  const preferences = getUserPreferences();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedLevelDescription, setSelectedLevelDescription] = useState<string>(
    preferences.proficiencyLevel 
      ? PROFICIENCY_LEVELS.find(level => level.id === preferences.proficiencyLevel)?.description || ""
      : ""
  );
  
  const { register, handleSubmit: handleFormSubmit, setValue, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      fullName: preferences.fullName || "",
      age: preferences.age?.toString() || "",
      gender: preferences.gender || "",
      geminiApiKey: preferences.geminiApiKey || "",
      proficiencyLevel: preferences.proficiencyLevel?.toString() || "",
    }
  });

  const formValues = watch();

  // Update description when proficiency level changes
  useEffect(() => {
    const level = PROFICIENCY_LEVELS.find(
      (level) => level.id.toString() === formValues.proficiencyLevel
    );
    if (level) {
      setSelectedLevelDescription(level.description || "");
    }
  }, [formValues.proficiencyLevel]);

  const handleProficiencyChange = (value: string) => {
    setValue("proficiencyLevel", value);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_DOMAIN}/api/Healthcheck`, {
        method: "GET",
        headers: {
          accept: "text/plain",
          Authentication: data.geminiApiKey,
        },
      });

      if (!response.ok) {
        throw new Error("API key validation failed");
      }

      // Save to localStorage with proper type conversion
      saveUserPreferences({
        ...preferences,
        fullName: data.fullName,
        age: data.age ? parseInt(data.age, 10) : undefined,
        gender: data.gender,
        geminiApiKey: data.geminiApiKey,
        proficiencyLevel: data.proficiencyLevel
          ? parseInt(data.proficiencyLevel, 10)
          : undefined,
      });

      toast.success("Thông tin đã được cập nhật thành công!");
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "API key validation failed. Please check your key and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xl transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Cập nhật thông tin
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
          <InputGroup
            id="fullName"
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            icon={UserCircle}
            error={errors.fullName?.message}
            disabled={loading}
            register={register}
            registerOptions={{ 
              required: "Vui lòng nhập họ và tên" 
            }}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              id="age"
              label="Tuổi"
              placeholder="Nhập tuổi"
              icon={CalendarRange}
              type="number"
              error={errors.age?.message}
              disabled={loading}
              register={register}
              registerOptions={{ 
                required: "Vui lòng nhập tuổi",
                min: { value: 1, message: "Tuổi phải lớn hơn 0" },
                max: { value: 100, message: "Tuổi phải nhỏ hơn 100" }
              }}
            />

            <SelectGroup
              label="Giới tính"
              placeholder="Chọn giới tính"
              icon={VenusAndMars}
              options={[
                { value: "male", label: "Nam" },
                { value: "female", label: "Nữ" },
                { value: "other", label: "Khác" },
              ]}
              value={formValues.gender}
              error={errors.gender?.message}
              disabled={loading}
              onValueChange={(value) => setValue("gender", value)}
              register={register("gender", { required: "Vui lòng chọn giới tính" })}
            />
          </div>

          <SelectGroup
            label="Trình độ tiếng Anh của bạn"
            placeholder="Chọn trình độ"
            icon={GraduationCap}
            options={PROFICIENCY_LEVELS.map(level => ({
              value: String(level.id),
              label: level.name
            }))}
            value={formValues.proficiencyLevel}
            error={errors.proficiencyLevel?.message}
            disabled={loading}
            onValueChange={handleProficiencyChange}
            register={register("proficiencyLevel", { required: "Vui lòng chọn trình độ" })}
          />

          {selectedLevelDescription && (
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              {selectedLevelDescription}
            </div>
          )}

          <InputGroup
            id="geminiApiKey"
            label="Gemini API Key"
            placeholder="Nhập API Key"
            icon={Key}
            type={showApiKey ? "text" : "password"}
            error={errors.geminiApiKey?.message || error || ""}
            disabled={loading}
            register={register}
            registerOptions={{ 
              required: "Vui lòng nhập API Key",
              minLength: { value: 39, message: "API key không hợp lệ" },
              pattern: { value: /^AIza/, message: "API key phải bắt đầu bằng 'AIza'" }
            }}
            rightElement={
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={loading}
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

          <DialogFooter>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-colors disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Cập nhật</span>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
