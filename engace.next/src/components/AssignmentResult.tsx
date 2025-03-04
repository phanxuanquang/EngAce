"use client";

import { AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Question = {
  Question: string;
  Options: string[];
  RightOptionIndex: number;
  ExplanationInVietnamese: string;
};

interface AssignmentResultProps {
  questions: Question[];
  selectedAnswers: number[];
}

export default function AssignmentResult({
  questions,
  selectedAnswers,
}: AssignmentResultProps) {
  const router = useRouter();

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return (
        score + (selectedAnswers[index] === question.RightOptionIndex ? 1 : 0)
      );
    }, 0);
  };

  return (
    <div className="space-y-4">
      {/* Score Summary */}
      <div className="rounded-md bg-white/40 backdrop-blur-md p-6 shadow-lg border border-white/20 dark:bg-slate-800/40 dark:border-slate-700/20">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
          Kết quả
        </h2>
        <div className="mb-6 text-center">
          <div className="mb-2 text-5xl font-bold text-purple-500">
            {calculateScore()}/{questions.length}
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            Tương đương{" "}
            {Math.round((calculateScore() / questions.length) * 100)}% yêu cầu
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <ScrollArea className="rounded-md bg-white/40 shadow-lg border border-white/20 dark:bg-slate-800/40 dark:border-slate-700/20 backdrop-blur-md overflow-hidden h-[calc(90vh-28rem)] md:h-[calc(80vh-20rem)]">
        <Accordion type="single" collapsible className="w-full">
          {questions.map((question, qIndex) => {
            const isCorrect =
              selectedAnswers[qIndex] === question.RightOptionIndex;

            return (
              <AccordionItem
                key={qIndex}
                value={`question-${qIndex}`}
                className={cn(
                  "border-b border-slate-200 dark:border-slate-700 last:border-0",
                  "focus-within:relative focus-within:z-10"
                )}
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline w-full text-left">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium text-slate-900 dark:text-white">
                      Câu {qIndex + 1}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-sm",
                        isCorrect
                          ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                      )}
                    >
                      {isCorrect ? "Đúng" : "Sai"}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-3 py-1 pb-3">
                  <div className="space-y-4">
                    <p className="text-slate-900 dark:text-white">
                      {question.Question}
                    </p>
                    <div className="space-y-2">
                      {question.Options.map((option, oIndex) => {
                        const isSelected = oIndex === selectedAnswers[qIndex];
                        const isCorrectAnswer =
                          oIndex === question.RightOptionIndex;

                        return (
                          <div
                            key={oIndex}
                            className={cn(
                              "rounded-lg border-2 p-3 relative",
                              isCorrectAnswer
                                ? "border-green-500 bg-green-50/80 backdrop-blur-md dark:border-green-400 dark:bg-green-900/20"
                                : isSelected
                                ? "border-red-500 bg-red-50/80 backdrop-blur-md dark:border-red-400 dark:bg-red-900/20"
                                : "border-slate-200 dark:border-slate-700"
                            )}
                          >
                            {option}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 rounded-lg bg-slate-50/80 backdrop-blur-md p-4 dark:bg-slate-700/50">
                      <div className="mb-2 flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">Giải thích</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {question.ExplanationInVietnamese}

                        <p className="italic mt-2">
                          EngAce đôi khi vẫn mắc sai sót. Bạn nên tự kiểm chứng
                          lại kết quả nha.
                        </p>
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>

      <div className="flex justify-center">
        <button
          onClick={() => router.push("/assignment")}
          className="text-white group relative w-full transform overflow-hidden rounded-md px-6 py-4 text-lg font-medium transition-all duration-200 bg-gradient-to-r bg-slate-600/50 hover:translate-y-[-2px] hover:shadow-xl dark:shadow-purple-900/25"
        >
          <div className="relative z-10 flex items-center justify-center space-x-2">
            <span>Làm bài tập mới</span>
          </div>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-purple-500 to-pink-400 transition-transform duration-500 group-hover:translate-x-0" />
        </button>
      </div>
    </div>
  );
}
