"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import ErrorDialog from "@/components/ErrorDialog";
import AssignmentResult from "@/components/AssignmentResult";
import { getAssignmentData, clearAssignmentData } from "@/lib/localStorage";
import ConfirmDialog from "@/components/ConfirmDialog";

type Question = {
  Question: string;
  Options: string[];
  RightOptionIndex: number;
  ExplanationInVietnamese: string;
};

function AssignmentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  return (
    <AssignmentContainer id={id} />
  );
}

function AssignmentContainer({ id }: { id: string | null }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;
    setIsSubmitted(true);
  }, [isSubmitted]);

  useEffect(() => {
    try {
      if (!id) throw new Error("No assignment data found");

      const questions = getAssignmentData(id);
      if (!questions || !Array.isArray(questions))
        throw new Error("Invalid assignment data format");

      setQuestions(questions);
      setSelectedAnswers(new Array(questions.length).fill(-1));
      setTimeRemaining(questions.length * 60); // Set time based on question count
    } catch {
      setError("Không thể tải bài tập. Vui lòng thử lại.");
      setShowError(true);
    }
  }, [id]);

  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, timeRemaining, handleSubmit]);
  

  const handleAnswerSelect = (optionIndex: number) => {
    if (isSubmitted) return;

    setSelectedAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const handleCancel = () => {
    setShowCancelConfirm(false);
    if (id) {
      clearAssignmentData(id);
    }
    router.push("/assignment");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!questions.length) return null;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50/95 via-purple-50/98 to-slate-100/95 dark:from-slate-950/95 dark:via-purple-900/40 dark:to-slate-950/95 overflow-hidden pt-16">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-pink-400 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-400 blur-3xl opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(255,255,255,0))]"></div>

      <Navbar />

      <div className="container mx-auto px-4 min-h-[calc(100vh-96px)]">
        <div className="mx-auto max-w-3xl w-full pt-8">
          {/* Progress and Timer Bar */}
          <div className="mb-4 rounded-md bg-white/60 backdrop-blur-xl p-4 shadow-lg border border-white/20 dark:bg-slate-800/60 dark:border-slate-700/30">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-900 dark:text-white/90">
                Câu {currentQuestionIndex + 1}/{questions.length}
              </div>
              <div className="flex items-center space-x-2 px-4 text-slate-600 dark:text-slate-300/90 backdrop-blur-sm px-3 py-1 rounded-lg bg-slate-400/20 dark:bg-slate-700/40">
                <Clock className="h-5 w-5" />
                <span
                  className={`font-mono ${
                    timeRemaining < 300 ? "text-red-500" : ""
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/30 backdrop-blur-sm dark:bg-slate-700/30">
              <div
                className="h-full bg-gradient-to-r from-purple-500/80 to-pink-400/80 transition-all duration-300 backdrop-blur-sm"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Question Section */}
          {!isSubmitted ? (
            <div className="space-y-6 rounded-xl bg-white/60 backdrop-blur-xl p-6 shadow-lg border border-white/20 dark:bg-slate-800/60 dark:border-slate-700/30">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white/90">
                {questions[currentQuestionIndex].Question}
              </h2>

              <div className="space-y-3">
                {questions[currentQuestionIndex].Options.map(
                  (option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full rounded-lg border p-4 text-left transition-all backdrop-blur-sm ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? "border-purple-500/50 bg-purple-50/50 text-purple-700 dark:border-purple-400/50 dark:bg-purple-900/30 dark:text-purple-200"
                          : "border-slate-200/60 bg-slate-300/40 hover:bg-slate-300/70 hover:border-purple-600/60 dark:border-slate-700/30 dark:bg-slate-700/40 dark:hover:bg-slate-400/40 dark:hover:border-purple-600/30"
                      }`}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentQuestionIndex === 0}
                    className="rounded-lg bg-slate-100/80 backdrop-blur-md px-4 py-2 text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    Câu trước
                  </button>
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(questions.length - 1, prev + 1)
                      )
                    }
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-400 px-4 py-2 text-white hover:from-purple-600 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Câu tiếp
                  </button>
                </div>
                <hr className="h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
                <div className="flex justify-between flex-col space-y-4">
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="text-white group relative w-full transform overflow-hidden rounded-md px-6 py-4 text-lg font-medium transition-all duration-200 bg-gradient-to-r bg-slate-600/50 hover:translate-y-[-2px] hover:shadow-xl dark:shadow-purple-900/25"
                  >
                    <div className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Nộp bài ngay</span>
                    </div>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-purple-500 to-pink-400 transition-transform duration-500 group-hover:translate-x-0" />
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full rounded-lg bg-red-100/80 backdrop-blur-md px-4 py-2 text-red-600 hover:bg-red-800 dark:bg-red-900/20 dark:text-red-400"
                  >
                    Hủy bài làm
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <AssignmentResult
              questions={questions}
              selectedAnswers={selectedAnswers}
            />
          )}
        </div>
      </div>

      <ErrorDialog
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={error}
      />

      <ConfirmDialog
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleSubmit}
        title="Nộp bài"
        message="Bạn có chắc chắn muốn nộp bài? Hành động này không thể hoàn tác."
        confirmText="Xác nhận"
      />

      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancel}
        title="Hủy bài làm"
        message="Bạn có chắc chắn muốn hủy bài làm? Mọi câu trả lời sẽ bị mất."
        confirmText="Xác nhận"
        cancelText="Tiếp tục làm bài"
      />
    </div>
  );
}

export default function DoAssignmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen relative bg-gradient-to-br from-slate-50/95 via-purple-50/98 to-slate-100/95 dark:from-slate-950/95 dark:via-purple-900/40 dark:to-slate-950/95 overflow-hidden pt-16">Loading...</div>}>
      <AssignmentContent />
    </Suspense>
  );
}
