"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserPreferences } from "@/lib/localStorage";
import { API_DOMAIN } from "@/lib/config";
import { Message, ChatResponse } from "./types";
import Navbar from "@/components/Navbar";
import ConfirmDialog from "@/components/app/dialog/ConfirmDialog";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import ChatControls from "./components/ChatControls";
import FirstVisitGuide from "./components/FirstVisitGuide";
import Suggestions from "./components/Suggestions";

const VISITED_KEY = "has-visited-chat";
const CHAT_HISTORY_KEY = "chat-history";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [hasRestoredMessages, setHasRestoredMessages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enableReasoning, setEnableReasoning] = useState(false);
  const [enableSearching, setEnableSearching] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
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
        const messagesWithDates: Message[] = parsedMessages.map(
          (msg: Omit<Message, "timestamp"> & { timestamp: string }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })
        );
        setMessages(messagesWithDates);
        // Set current suggestions if available from last AI message
        const lastAiMessage = [...messagesWithDates]
          .reverse()
          .find((msg: Message) => msg.sender === "ai");
        if (lastAiMessage?.suggestions) {
          setCurrentSuggestions(lastAiMessage.suggestions);
        }
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

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (hasRestoredMessages) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages, hasRestoredMessages]);

  useEffect(() => {
    // Cleanup object URLs when component unmounts
    return () => {
      messages.forEach((msg) => msg.images?.forEach(URL.revokeObjectURL));
    };
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
    setCurrentSuggestions([]);
  };

  const getImageUrls = (images: File[]): string[] => {
    return images.map((image) => URL.createObjectURL(image));
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

  const handleSend = async (message = inputMessage) => {
    if (!message.trim() || isProcessing) return;

    const imageUrls =
      selectedImages.length > 0 ? getImageUrls(selectedImages) : undefined;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
      images: imageUrls,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setCurrentSuggestions([]);
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

      const requestData = {
        ChatHistory: [
          ...chatHistory,
          { FromUser: true, Message: message.trim() },
        ],
        Question: message.trim(),
        imagesAsBase64,
      };

      const headers: HeadersInit = {
        accept: "application/json",
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

      setEnableReasoning(false);
      setEnableSearching(false);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const aiResponse: ChatResponse = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.MessageInMarkdown,
        sender: "ai",
        timestamp: new Date(),
        suggestions: aiResponse.Suggestions,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setCurrentSuggestions(aiResponse.Suggestions || []);
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

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-purple-400 to-blue-600">
      <Navbar />

      <div className="container mx-auto px-2 pt-20 pb-4 h-screen flex flex-col max-w-5xl">
        <ChatMessages
          messages={messages}
          isProcessing={isProcessing}
          onClearChat={handleClearChat}
          isClearing={isClearing}
          onShowClearConfirm={() => setShowClearConfirm(true)}
        />

        <div className="bg-white dark:bg-slate-800 border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-xl p-3 shadow-xl space-y-3">
          {/* Suggestions */}
          {currentSuggestions.length > 0 && !isProcessing && (
            <div className="p-1">
              <Suggestions
                suggestions={currentSuggestions}
                onSuggestionClick={handleSuggestionClick}
                isProcessing={isProcessing}
              />
            </div>
          )}

          <ChatInput
            inputMessage={inputMessage}
            onInputChange={setInputMessage}
            onSend={() => handleSend()}
            isProcessing={isProcessing}
            selectedImages={selectedImages}
            onImageSelect={handleImageSelect}
            onRemoveImage={(index) =>
              setSelectedImages((prev) =>
                prev.filter((_, i) => i !== index)
              )
            }
          />
          <ChatControls
            onImageClick={() => fileInputRef.current?.click()}
            enableReasoning={enableReasoning}
            onReasoningToggle={() => {
              setEnableReasoning(!enableReasoning);
              if (!enableReasoning) setEnableSearching(false);
            }}
            enableSearching={enableSearching}
            onSearchingToggle={() => {
              setEnableSearching(!enableSearching);
              if (!enableSearching) setEnableReasoning(false);
            }}
          />
        </div>
      </div>

      {showGuide && <FirstVisitGuide onClose={() => setShowGuide(false)} />}

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          setIsClearing(true);
          handleClearChat();
          setIsClearing(false);
          setShowClearConfirm(false);
        }}
        title="Xóa lịch sử trò chuyện"
        message="Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
      />

      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageSelect}
      />
    </div>
  );
}
