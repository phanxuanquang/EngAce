"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, Brain, Search, Image, X } from "lucide-react";
import { getUserPreferences } from "@/lib/localStorage";
import { API_DOMAIN } from "@/lib/config";
import Navbar from "@/components/Navbar";
import TypingIndicator from "@/components/TypingIndicator";
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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showGuide, setShowGuide] = useState(false);
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

    setMessages([
      {
        id: "welcome",
        content:
          "Xin chào! Tôi là EngAce, trợ lý ảo được cá nhân hóa để giúp bạn học tiếng Anh. 👋\n\nBạn có thể sử dụng cú pháp **markdown** để giúp tin nhắn được trình bày tốt hơn.",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  }, [router, preferences.hasCompletedOnboarding]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getImageUrls = (images: File[]): string[] => {
    return images.map(image => URL.createObjectURL(image));
  };

  useEffect(() => {
    // Cleanup object URLs when component unmounts
    return () => {
      messages.forEach(msg => msg.images?.forEach(URL.revokeObjectURL));
    };
  }, [messages]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const convertImagesToBase64 = async (images: File[]): Promise<string[]> => {
    const base64Promises = images.map((image) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert image to base64'));
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

    const imageUrls = selectedImages.length > 0 ? getImageUrls(selectedImages) : undefined;
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

      const imagesAsBase64 = selectedImages.length > 0 
        ? await convertImagesToBase64(selectedImages)
        : undefined;

      const requestData: ChatRequest = {
        ChatHistory: [
          ...chatHistory,
          { FromUser: true, Message: inputMessage },
        ],
        Question: inputMessage,
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
      url.searchParams.append("username", preferences.fullName || 'guest');
      url.searchParams.append("gender", preferences.gender || 'Unknown');
      url.searchParams.append("age", (preferences.age || 18).toString());
      url.searchParams.append("englishLevel", (preferences.proficiencyLevel || 1).toString());
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
      <div className="container mx-auto px-4 pt-20 pb-4 h-screen flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto rounded-t-xl bg-white dark:bg-slate-800 shadow-lg">
          <div className="p-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-gray-300 dark:bg-gray-700"
                      : "bg-slate-200 dark:bg-slate-900"
                  }`}
                >
                  <div
                    className={`${
                      message.sender === "user"
                        ? "prose-invert"
                        : "prose-slate dark:prose-invert"
                    }`}
                  >
                    <MarkdownRenderer>{message.content}</MarkdownRenderer>
                  </div>
                  {message.images && message.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.images.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Attached ${index + 1}`}
                          className="max-w-[200px] h-auto rounded-lg"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
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
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 rounded-b-xl p-4 shadow-lg space-y-3">
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
            <button
              onClick={handleImageClick}
              className="rounded-lg p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <Image className="h-5 w-5" />
            </button>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Aa... (Shift + Enter để xuống dòng)"
              disabled={isProcessing}
              required
              className={`flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200`}
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
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="h-16 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                    <button
                      onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Toggle Buttons */}
          <div className="flex items-center justify-start space-x-4">
            <button
              onClick={() => {
                setEnableReasoning(!enableReasoning);
                if (!enableReasoning) setEnableSearching(false);
              }}
              className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm transition-all ${
                enableReasoning
                  ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 dark:from-blue-600/30 dark:to-blue-700/30 dark:text-blue-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>Suy luận sâu</span>
            </button>
            <button
              onClick={() => {
                setEnableSearching(!enableSearching);
                if (!enableSearching) setEnableReasoning(false);
              }}
              className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm transition-all ${
                enableSearching
                  ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 dark:from-green-600/30 dark:to-green-700/30 dark:text-green-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Tìm kiếm trên Google</span>
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
    </div>
  );
}
