"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, Brain, Search, Image, X } from "lucide-react";
import NextImage from "next/image";
import { getUserPreferences } from "@/lib/localStorage";
import { API_DOMAIN } from "@/lib/config";
import Navbar from "@/components/Navbar";
import TypingIndicator from "@/components/TypingIndicator";
import ConfirmDialog from "@/components/ConfirmDialog";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  images?: string[];
  timestamp: Date;
};

interface ChatRequest {
  ChatHistory: {
    FromUser: boolean;
    Message: string;
  }[];
  Question: string;
  imagesAsBase64?: string[];
}

const VISITED_KEY = "has-visited-chat";
const CHAT_HISTORY_KEY = "chat-history";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [hasRestoredMessages, setHasRestoredMessages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enableReasoning, setEnableReasoning] = useState(false);
  const [enableSearching, setEnableSearching] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const preferences = getUserPreferences();

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.push("/");
      return;
    }

    const hasVisited = localStorage.getItem(VISITED_KEY);
    if (!hasVisited) {
      setShowGuide(true);
      localStorage.setItem(VISITED_KEY, "true");
    }

    // Load messages from localStorage
    const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedMessages && !hasRestoredMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDates = parsedMessages.map(
          (msg: Omit<Message, "timestamp"> & { timestamp: string }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })
        );
        setMessages(messagesWithDates);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    } else if (!hasRestoredMessages) {
      setMessages([
        {
          id: "welcome",
          content: `Chào ${preferences.fullName}! Mình là EngAce, trợ lý ảo được thiết kế riêng để hỗ trợ bạn học tiếng Anh nè. 😊\n\nMình luôn cố gắng hỗ trợ bạn tốt nhất, nhưng đôi khi vẫn có thể mắc sai sót, nên bạn nhớ kiểm tra lại những thông tin quan trọng nha!`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
    setHasRestoredMessages(true);
  }, [
    router,
    preferences.hasCompletedOnboarding,
    hasRestoredMessages,
    preferences.fullName,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getImageUrls = (images: File[]): string[] => {
    return images.map((image) => URL.createObjectURL(image));
  };

  useEffect(() => {
    // Cleanup object URLs when component unmounts
    return () => {
      messages.forEach((msg) => msg.images?.forEach(URL.revokeObjectURL));
    };
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (hasRestoredMessages) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages, hasRestoredMessages]);

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic', 'image/heif'];
    
    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      alert('Chỉ chấp nhận các file ảnh định dạng PNG, JPG, JPEG, HEIC, HEIF');
      return;
    }

    // Filter out already selected images by comparing file names and sizes
    const newFiles = validFiles.filter(newFile => 
      !selectedImages.some(existingFile => 
        existingFile.name === newFile.name && 
        existingFile.size === newFile.size
      )
    );

    if (selectedImages.length + newFiles.length > 10) {
      alert('Chỉ được chọn tối đa 10 ảnh');
      return;
    }

    setSelectedImages((prev) => [...prev, ...newFiles]);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const convertImagesToBase64 = async (images: File[]): Promise<string[]> => {
    const base64Promises = images.map((image) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert image to base64"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    });
    return Promise.all(base64Promises);
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const imageUrls =
      selectedImages.length > 0 ? getImageUrls(selectedImages) : undefined;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      images: imageUrls,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsProcessing(true);

    try {
      // Format chat history for API
      const chatHistory = messages.map((msg) => ({
        FromUser: msg.sender === "user",
        Message: msg.content,
      }));

      const imagesAsBase64 =
        selectedImages.length > 0
          ? await convertImagesToBase64(selectedImages)
          : undefined;

      const requestData: ChatRequest = {
        ChatHistory: [
          ...chatHistory,
          { FromUser: true, Message: inputMessage.trim() },
        ],
        Question: inputMessage.trim(),
        imagesAsBase64,
      };

      const headers: HeadersInit = {
        accept: "text/plain",
        "Content-Type": "application/json",
      };

      if (preferences.geminiApiKey) {
        headers["Authentication"] = preferences.geminiApiKey;
      }

      // Construct URL with query parameters
      const url = new URL(`${API_DOMAIN}/api/Chatbot/GenerateAnswer`);
      url.searchParams.append(
        "username",
        preferences.fullName?.trim() || "guest"
      );
      url.searchParams.append("gender", preferences.gender || "Unknown");
      url.searchParams.append("age", (preferences.age || 16).toString());
      url.searchParams.append(
        "englishLevel",
        (preferences.proficiencyLevel || 3).toString()
      );
      url.searchParams.append("enableReasoning", enableReasoning.toString());
      url.searchParams.append("enableSearching", enableSearching.toString());

      setSelectedImages([]);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const aiResponse = await response.text();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: "ai",
        timestamp: new Date(),
        images: undefined,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-purple-400 to-blue-600">
      <Navbar />

      {/* Chat Container */}
      <div className="container mx-auto px-4 pt-20 pb-4 h-screen flex flex-col max-w-5xl">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto rounded-t-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="p-4 space-y-4 scroll-smooth">
            {/* Clear Chat Button */}
            {messages.length > 0 && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={isClearing}
                  className={`px-4 py-1 text-xs font-semibold rounded-lg transition-all duration-300 shadow-md hover:ring-red-800 hover:ring  ${
                    isClearing
                      ? "bg-red-200 text-red-800 cursor-not-allowed shadow-red-200/50"
                      : "bg-red-100 text-red-800 hover:bg-red-200 shadow-red-100/50"
                  }`}
                >
                  Xóa cuộc trò chuyện
                </button>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex flex-col space-y-1 ${
                    message.sender === "user" ? "items-end" : "items-start"
                  } w-[80%] md:w-[70%]`}
                >
                  <div
                    className={`w-fit px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-gray-100 dark:bg-slate-700 rounded-t-2xl rounded-l-2xl ml-auto"
                        : "bg-gradient-to-r from-orange-700 to-amber-600 text-white rounded-t-2xl rounded-r-2xl"
                    }`}
                  >
                    <div
                      className={`${
                        message.sender === "user"
                          ? "text-slate-900 dark:text-slate-100"
                          : "text-white"
                      }`}
                    >
                      <MarkdownRenderer>{message.content}</MarkdownRenderer>
                    </div>
                    {message.images && message.images.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.images.map((imageUrl, index) => (
                          <NextImage
                            key={index}
                            src={imageUrl}
                            alt={`Attached ${index + 1}`}
                            className="rounded-lg"
                            loading="lazy"
                            width={200}
                            height={200}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-slate-800 border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-xl p-4 shadow-xl space-y-3">
          {/* Text Input */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
              }}
              placeholder="Shift + Enter để xuống dòng"
              disabled={isProcessing}
              required
              className={`text-sm xs:text-xs flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 max-h-32`}
            />
            <button
              onClick={handleSend}
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
                  onClick={() =>
                  setSelectedImages((prev) =>
                    prev.filter((_, i) => i !== index)
                  )
                  }
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
                </div>
              ))}
              </div>
            </div>
          )}
          {/* Toggle Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleImageClick}
              className="text-slate-600 dark:text-slate-400 flex items-center justify-center sm:space-x-2 rounded-lg px-3 py-1.5 text-xs transition-all dark:bg-slate-700 bg-slate-100 w-full"
            >
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Đính kèm ảnh</span>
            </button>
            <button
              onClick={() => {
                setEnableReasoning(!enableReasoning);
                if (!enableReasoning) setEnableSearching(false);
              }}
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
              onClick={() => {
                setEnableSearching(!enableSearching);
                if (!enableSearching) setEnableReasoning(false);
              }}
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
        </div>
      </div>

      {/* First Visit Guide Dialog */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg transform rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
            <div className="mb-6">
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                Trò chuyện cùng gia sư ảo
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>Đây là nơi bạn có thể tương tác với gia sư ảo để:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    Tham gia các cuộc thảo luận về nhiều chủ đề học tiếng Anh
                  </li>
                  <li>
                    Nhận lời khuyên và mẹo để vượt qua các thách thức trong học
                    tập
                  </li>
                  <li>
                    Đặt câu hỏi và nhận câu trả lời chi tiết về việc học tiếng
                    Anh
                  </li>
                </ul>
                <p className="font-medium">Tính năng đặc biệt:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Hỗ trợ định dạng Markdown cho văn bản phong phú</li>
                  <li>Trả lời nhanh chóng và chính xác</li>
                  <li>Tương tác bằng cả tiếng Việt và tiếng Anh</li>
                  <li>Lưu trữ lịch sử trò chuyện trong phiên làm việc</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="w-full rounded-lg bg-gradient-to-r from-orange-700 to-amber-600 px-4 py-3 text-white hover:from-orange-700 hover:to-amber-700 transition-all duration-200 font-medium"
            >
              Bắt đầu trò chuyện
            </button>
          </div>
        </div>
      )}

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          setIsClearing(true);
          handleClearChat();
          setIsClearing(false);
        }}
        title="Xóa lịch sử trò chuyện"
        message="Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
      />
    </div>
  );
}
