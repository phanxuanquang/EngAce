"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound, Key, X, Loader2, AlertCircle } from "lucide-react";
import { PROFICIENCY_LEVELS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserPreferences, saveUserPreferences } from "@/lib/localStorage";
import { API_DOMAIN } from "@/lib/config";

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  fullName?: string;
  age?: string;
  gender?: string;
  geminiApiKey?: string;
  proficiencyLevel?: string;
}

export default function UserProfileDialog({
  isOpen,
  onClose,
}: UserProfileDialogProps) {
  const preferences = getUserPreferences();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedLevelDescription, setSelectedLevelDescription] = useState<
    string
  >("");
  const [formData, setFormData] = useState({
    fullName: preferences.fullName || "",
    age: preferences.age?.toString() || "",
    gender: preferences.gender || "",
    geminiApiKey: preferences.geminiApiKey || "",
    proficiencyLevel: preferences.proficiencyLevel?.toString() || "",
  });

  // Update description when proficiency level changes
  const handleProficiencyChange = (value: string) => {
    setFormData({ ...formData, proficiencyLevel: value });
    const level = PROFICIENCY_LEVELS.find(
      (level) => level.id.toString() === value
    );
    setSelectedLevelDescription(level?.description || "");
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên";
      isValid = false;
    }

    if (!formData.age) {
      errors.age = "Vui lòng nhập tuổi";
      isValid = false;
    }

    if (!formData.gender) {
      errors.gender = "Vui lòng chọn giới tính";
      isValid = false;
    }

    if (!formData.geminiApiKey.trim()) {
      errors.geminiApiKey = "Vui lòng nhập API Key";
      isValid = false;
    }

    if (!formData.proficiencyLevel) {
      errors.proficiencyLevel = "Vui lòng chọn trình độ";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_DOMAIN}/api/Healthcheck`, {
        method: "GET",
        headers: {
          accept: "text/plain",
          Authentication: formData.geminiApiKey,
        },
      });

      if (!response.ok) {
        throw new Error("API key validation failed");
      }

      // Save to localStorage with proper type conversion
      saveUserPreferences({
        ...preferences,
        fullName: formData.fullName,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        gender: formData.gender,
        geminiApiKey: formData.geminiApiKey,
        proficiencyLevel: formData.proficiencyLevel
          ? parseInt(formData.proficiencyLevel, 10)
          : undefined,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-0"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="w-full max-w-xl transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Cập nhật thông tin
              </h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Họ và tên
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      formErrors.fullName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-sm sm:text-base`}
                  />
                  <UserRound className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
                {formErrors.fullName && (
                  <div className="flex items-center mt-1 text-xs sm:text-sm text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.fullName}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Tuổi
                  </label>
                  <input
                    id="age"
                    type="number"
                    placeholder="Nhập tuổi"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    min={1}
                    max={100}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      formErrors.age
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-sm sm:text-base`}
                  />
                  {formErrors.age && (
                    <div className="flex items-center mt-1 text-xs sm:text-sm text-red-500">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.age}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Giới tính
                  </label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger
                      id="gender"
                      className={
                        formErrors.gender
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.gender && (
                    <div className="flex items-center mt-1 text-xs sm:text-sm text-red-500">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.gender}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="proficiencyLevel"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Trình độ tiếng Anh của bạn
                </label>
                <Select
                  value={formData.proficiencyLevel}
                  onValueChange={handleProficiencyChange}
                >
                  <SelectTrigger
                    id="proficiencyLevel"
                    className={
                      formErrors.proficiencyLevel
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Chọn trình độ" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.proficiencyLevel && (
                  <div className="flex items-center mt-1 text-xs sm:text-sm text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.proficiencyLevel}
                  </div>
                )}
                {selectedLevelDescription && (
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    {selectedLevelDescription}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="geminiApiKey"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    id="geminiApiKey"
                    type="password"
                    placeholder="Nhập API Key"
                    value={formData.geminiApiKey}
                    onChange={(e) =>
                      setFormData({ ...formData, geminiApiKey: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      formErrors.geminiApiKey || error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-sm sm:text-base`}
                  />
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
                {(formErrors.geminiApiKey || error) && (
                  <div className="flex items-center mt-1 text-xs sm:text-sm text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.geminiApiKey || error}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2 mt-6">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm sm:text-base"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white transition-colors text-sm sm:text-base disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Cập nhật</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
