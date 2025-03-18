import { Send, X } from "lucide-react";
import NextImage from "next/image";
import { useRef } from "react";

interface ChatInputProps {
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isProcessing: boolean;
  selectedImages: File[];
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export default function ChatInput({
  inputMessage,
  onInputChange,
  onSend,
  isProcessing,
  selectedImages,
  onImageSelect,
  onRemoveImage,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageSelect}
          accept="image/*"
          multiple
          className="hidden"
        />
        <textarea
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Shift + Enter để xuống dòng"
          disabled={isProcessing}
          required
          className={`text-sm xs:text-xs flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 max-h-32`}
        />
        <button
          onClick={onSend}
          disabled={isProcessing || !inputMessage.trim()}
          className={`rounded-lg p-2.5 text-white transition-all duration-200 ${
            isProcessing || !inputMessage.trim()
              ? "bg-slate-400 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-orange-700 to-amber-600 hover:from-orange-700 hover:to-amber-700"
          }`}
        >
          <Send className={`h-5 w-5 ${isProcessing ? "opacity-50" : ""}`} />
        </button>
      </div>

      {/* Image Preview */}
      {selectedImages.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 transition-all duration-300">
          <div className="flex items-center gap-2 overflow-x-auto">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative group">
                <NextImage
                  src={URL.createObjectURL(image)}
                  alt={`Image preview ${index + 1}`}
                  className="h-16 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 group-hover:opacity-50 transition-opacity duration-200"
                  width={64}
                  height={64}
                />
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}