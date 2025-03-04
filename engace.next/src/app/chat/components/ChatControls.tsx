import { Brain, Image, Search } from "lucide-react";

interface ChatControlsProps {
  onImageClick: () => void;
  enableReasoning: boolean;
  onReasoningToggle: () => void;
  enableSearching: boolean;
  onSearchingToggle: () => void;
}

export default function ChatControls({
  onImageClick,
  enableReasoning,
  onReasoningToggle,
  enableSearching,
  onSearchingToggle,
}: ChatControlsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={onImageClick}
        className="text-slate-600 dark:text-slate-400 flex items-center justify-center sm:space-x-2 rounded-lg px-3 py-1.5 text-xs transition-all dark:bg-slate-700 bg-slate-100 w-full"
      >
        <Image className="h-4 w-4" />
        <span className="hidden sm:inline">Đính kèm ảnh</span>
      </button>
      <button
        onClick={onReasoningToggle}
        className={`flex items-center justify-center sm:space-x-2 rounded-lg px-3 py-1.5 text-xs transition-all w-full ${
          enableReasoning
            ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 dark:from-blue-600/30 dark:to-blue-700/30 dark:text-blue-300"
            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
        }`}
      >
        <Brain className="h-4 w-4" />
        <span className="hidden sm:inline">Suy luận sâu</span>
      </button>
      <button
        onClick={onSearchingToggle}
        className={`flex items-center justify-center sm:space-x-2 rounded-lg px-3 py-1.5 text-xs transition-all w-full ${
          enableSearching
            ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 dark:from-green-600/30 dark:to-green-700/30 dark:text-green-300"
            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
        }`}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Tìm kiếm trên Google</span>
      </button>
    </div>
  );
}