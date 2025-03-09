import { useRef } from "react";
import { Message } from "../types";
import MessageItem from "./MessageItem";
import TypingIndicator from "@/components/TypingIndicator";

interface ChatMessagesProps {
  messages: Message[];
  isProcessing: boolean;
  onClearChat: () => void;
  isClearing: boolean;
  onShowClearConfirm: () => void;
}

export default function ChatMessages({
  messages,
  isProcessing,
  isClearing,
  onShowClearConfirm,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] rounded-t-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
      <div className="p-3 space-y-2 scroll-smooth">
        {/* Clear Chat Button */}
        {messages.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={onShowClearConfirm}
              disabled={isClearing}
              className={`px-4 py-1 text-xs font-semibold rounded-lg transition-all duration-300 shadow-md hover:ring-red-800 hover:ring ${
                isClearing
                  ? "bg-red-200 text-red-800 cursor-not-allowed shadow-red-200/50"
                  : "bg-red-100 text-red-800 hover:bg-red-200 shadow-red-100/50"
              }`}
            >
              Xóa cuộc trò chuyện
            </button>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {/* Typing Indicator */}
        {isProcessing && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}