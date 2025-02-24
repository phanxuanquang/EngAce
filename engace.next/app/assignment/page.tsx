"use client";

import { useEffect, useState } from "react";
import { Sparkles, BookOpen, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { getUserPreferences } from "@/lib/localStorage";
import Navbar from "@/components/Navbar";

export default function AssignmentPage() {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isSuggestionsExpanded, setIsSuggestionsExpanded] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [assignmentTypes, setAssignmentTypes] = useState<
    Record<string, string>
  >({});
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const preferences = getUserPreferences();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch assignment types
        const typesResponse = await fetch(
          "https://localhost:5000/api/Assignment/GetAssignmentTypes",
          {
            headers: {
              Accept: "text/plain",
            },
          }
        );
        const types = await typesResponse.json();
        setAssignmentTypes(types);

        const topicsResponse = await fetch(
          "https://localhost:5000/api/Assignment/Suggest3Topics?englishLevel=3",
          {
            headers: {
              Accept: "text/plain",
              Authentication: preferences.geminiApiKey || "",
            },
          }
        );
        const topics = await topicsResponse.json();
        setSuggestedTopics(topics);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleTopicSelect = (selectedTopic: string) => {
    setTopic(selectedTopic);
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const isFormValid =
    topic.trim() !== "" &&
    selectedTypes.length > 0 &&
    questionCount >= 1 &&
    questionCount <= 50;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-purple-400 to-blue-600">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-br from-purple-400/20 to-blue-400/20 blur-[160px] animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-[160px] animate-pulse-slow delay-1000"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(255,255,255,0))]"></div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 container mx-auto px-4 py-10"
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30"
            >
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 text-white">
                <Sparkles className="h-10 w-10" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400"
            >
              Bài tập
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-slate-600 dark:text-slate-400"
            >
              Thiết lập sao cho phù hợp với nhu cầu và trình độ của bạn
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 p-6 space-y-6"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
            ) : (
              <>
                {/* Topic Input */}
                <div className="grid gap-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="topic"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Chủ đề
                    </Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Nhập chủ đề bài tập..."
                        className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Question Count Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="questionCount"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Số lượng câu hỏi
                    </Label>
                    <Input
                      id="questionCount"
                      type="number"
                      min={1}
                      max={100}
                      value={questionCount}
                      onChange={(e) =>
                        setQuestionCount(
                          Math.max(1, Math.min(100, Number(e.target.value)))
                        )
                      }
                      className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
                    />
                    {questionCount < 1 || questionCount > 50 ? (
                      <p className="mt-1 text-sm text-red-500">
                        Số lượng câu hỏi phải từ 1 đến 50
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Suggested Topics */}
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      setIsSuggestionsExpanded(!isSuggestionsExpanded)
                    }
                    className="w-full flex items-center justify-between py-1 group"
                  >
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      Gợi ý chủ đề
                    </Label>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 dark:group-hover:text-slate-300 ${
                        isSuggestionsExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div className="overflow-hidden">
                    <motion.div
                      animate={{
                        height: isSuggestionsExpanded ? "auto" : 0,
                        opacity: isSuggestionsExpanded ? 1 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                    >
                      {isSuggestionsExpanded &&
                        suggestedTopics.map((suggestedTopic, index) => (
                          <motion.button
                            key={suggestedTopic}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-full text-left px-4 py-2 rounded-lg border transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 ${
                              topic === suggestedTopic
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-sm"
                                : "border-slate-200 dark:border-slate-700"
                            }`}
                            onClick={() => handleTopicSelect(suggestedTopic)}
                          >
                            {suggestedTopic}
                          </motion.button>
                        ))}
                    </motion.div>
                  </div>
                </div>

                {/* Assignment Types */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Loại bài tập
                  </Label>
                  <div className="grid gap-2 max-h-[190px] overflow-y-auto pr-2 py-1">
                    <AnimatePresence>
                      {Object.entries(assignmentTypes).map(
                        ([id, name], index) => (
                          <motion.div
                            key={id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button
                              variant="outline"
                              className={`w-full justify-start p-4 group hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 ${
                                selectedTypes.includes(id)
                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-sm"
                                  : "border-slate-200 dark:border-slate-700"
                              }`}
                              onClick={() => handleTypeToggle(id)}
                            >
                              {name}
                            </Button>
                          </motion.div>
                        )
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <button
                    disabled={!isFormValid}
                    className={`group relative w-full transform overflow-hidden rounded-xl px-6 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 ${
                      !isFormValid
                        ? "cursor-not-allowed bg-slate-500"
                        : "bg-gradient-to-r from-purple-500 to-pink-400 shadow-purple-500/25 hover:translate-y-[-2px] hover:shadow-xl dark:shadow-purple-900/25"
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-center space-x-2">
                      <Sparkles className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                      <span>Tạo bài tập</span>
                    </div>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-purple-500 to-pink-400 transition-transform duration-500 group-hover:translate-x-0" />
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
