"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Sparkles, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getUserPreferences, setAssignmentData } from "@/lib/localStorage";
import ErrorDialog from "@/components/ErrorDialog";
import { API_DOMAIN } from "@/lib/config";

type AssignmentType = {
  id: string;
  name: string;
};

export default function AssignmentPage() {
  const router = useRouter();
  const preferences = getUserPreferences();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [topic, setTopic] = useState("");
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [assignmentTypes, setAssignmentTypes] = useState<AssignmentType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);

  const fetchAssignmentTypes = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_DOMAIN}/api/Assignment/GetAssignmentTypes`,
        {
          headers: {
            Authentication: preferences.geminiApiKey || "",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch assignment types");

      const data = await response.json();
      const types: AssignmentType[] = Object.entries(data).map(
        ([id, name]) => ({
          id,
          name: name as string,
        })
      );
      setAssignmentTypes(types);
    } catch (error) {
      console.error("Error fetching assignment types:", error);
    }
  }, [preferences.geminiApiKey]);

  const fetchSuggestedTopics = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_DOMAIN}/api/Assignment/SuggestTopics?englishLevel=${preferences.proficiencyLevel}`,
        {
          headers: {
            Authentication: preferences.geminiApiKey || "",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch suggested topics");

      const topics = await response.json();
      setSuggestedTopics(topics);
    } catch (error) {
      console.error("Error fetching suggested topics:", error);
    }
  }, [preferences.geminiApiKey, preferences.proficiencyLevel]);

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.push("/");
      return;
    }

    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        await Promise.all([fetchAssignmentTypes(), fetchSuggestedTopics()]);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [
    router,
    preferences.hasCompletedOnboarding,
    fetchAssignmentTypes,
    fetchSuggestedTopics,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !topic.trim() || selectedTypes.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/api/Assignment/Generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: preferences.geminiApiKey || "",
        },
        body: JSON.stringify({
          Topic: topic,
          AssignmentTypes: selectedTypes.map((id) => parseInt(id)),
          EnglishLevel: preferences.proficiencyLevel,
          TotalQuestions: questionCount,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate assignment");

      const questions = await response.json();
      const timestamp = Date.now();

      // Store questions data in localStorage with a timestamp as identifier
      setAssignmentData(timestamp.toString(), questions);

      router.push(`/assignment/do?id=${timestamp}`);
    } catch (err) {
      console.error("Error generating assignment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate assignment"
      );
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400 via-pink-400 to-purple-600">
        <div className="fixed -top-40 -left-40 h-80 w-80 rounded-full bg-pink-400 dark:bg-pink-600 blur-3xl opacity-30 animate-pulse"></div>
        <div className="fixed -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-400 dark:bg-purple-600 blur-3xl opacity-30 animate-pulse"></div>
        <div className="relative flex flex-col items-center space-y-6 text-slate-900 dark:text-white">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-slate-200/50 dark:bg-slate-700/50"></div>
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          </div>
          <div className="flex flex-col items-center space-y-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400 via-pink-400 to-purple-600">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-pink-400 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-400 blur-3xl opacity-30"></div>
      <Navbar />

      <div className="container mx-auto px-4 pt-20 py-10 mt-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
              BÀI TẬP
            </h1>
            <p className="mx-auto max-w-xl text-slate-600 dark:text-slate-400 text-sm">
              Thiết lập bài tập phù hợp với nhu cầu học tập của bạn với các chủ
              đề và dạng bài tập đa dạng.
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-md text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400/10"
                    placeholder="Nhập chủ đề bài tập..."
                    required
                  />
                </div>

                {suggestedTopics.length > 0 && (
                  <div className="rounded-md bg-white p-4 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="mb-4 flex items-center space-x-2 text-slate-900 dark:text-white">
                      <Sparkles className="h-5 w-5" />
                      <h2 className="font-semibold">Chủ đề gợi ý</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTopics.map((suggestedTopic, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setTopic(suggestedTopic)}
                          className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                            topic === suggestedTopic
                              ? "bg-gradient-to-r from-purple-500/30 to-pink-400/30"
                              : "bg-slate-200/50 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                          }`}
                        >
                          {suggestedTopic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Số lượng câu hỏi
                </label>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  autoComplete="off"
                  placeholder="10"
                  min={5}
                  max={100}
                  disabled={isLoading}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-md bg-white px-4 py-2 text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-400/10"
                />
              </div>

              {/* Question Types */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Chọn một hoặc nhiều dạng câu hỏi
                </label>
                <div className="max-h-48 overflow-y-auto rounded-md bg-white dark:bg-slate-800 p-2 space-y-2 border border-slate-200 dark:border-slate-700">
                  {assignmentTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleTypeToggle(type.id)}
                      className={`w-full px-4 py-3 text-sm font-medium transition-all flex items-center rounded-lg ${
                        selectedTypes.includes(type.id)
                          ? "bg-gradient-to-r from-purple-500/30 to-pink-400/30"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isLoading || !topic.trim() || selectedTypes.length === 0
                }
                className={`text-white group relative w-full transform overflow-hidden rounded-md px-6 py-4 text-lg font-medium shadow-lg transition-all duration-200 ${
                  isLoading || !topic.trim() || selectedTypes.length === 0
                    ? "cursor-not-allowed bg-slate-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-400 shadow-purple-500/25 hover:translate-y-[-2px] hover:shadow-xl dark:shadow-purple-900/25"
                }`}
              >
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <GraduationCap className="h-5 w-5" />
                  )}
                  <span>
                    {isLoading ? "Đang tạo bài tập..." : "Tạo bài tập"}
                  </span>
                </div>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-purple-500 to-pink-400 transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <ErrorDialog
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={error}
      />
    </div>
  );
}
