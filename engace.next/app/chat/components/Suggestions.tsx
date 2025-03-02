import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isProcessing: boolean;
}

export default function Suggestions({
  suggestions,
  onSuggestionClick,
  isProcessing,
}: SuggestionsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="relative">
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white via-white to-transparent dark:from-slate-800 dark:via-slate-800 dark:to-transparent px-2 h-full flex items-center"
        >
          <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white via-white to-transparent dark:from-slate-800 dark:via-slate-800 dark:to-transparent px-2 h-full flex items-center"
        >
          <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="flex overflow-x-auto space-x-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => !isProcessing && onSuggestionClick(suggestion)}
            className={`shrink-0 text-sm px-3 py-1 rounded-full ${
              isProcessing
                ? "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
            } transition-colors duration-200`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            whileHover={!isProcessing ? { scale: 1.02 } : {}}
            whileTap={!isProcessing ? { scale: 0.98 } : {}}
            disabled={isProcessing}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
}