export type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  images?: string[];
  suggestions?: string[];
  timestamp: Date;
};

export interface ChatRequest {
  ChatHistory: {
    FromUser: boolean;
    Message: string;
  }[];
  Question: string;
  imagesAsBase64?: string[];
}

export interface ChatResponse {
  MessageInMarkdown: string;
  Suggestions: string[];
}