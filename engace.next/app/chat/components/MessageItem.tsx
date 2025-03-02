import NextImage from "next/image";
import { Message } from "../types";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  return (
    <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col space-y-1 ${
          message.sender === "user" ? "items-end" : "items-start"
        } w-[80%] md:w-[70%]`}
      >
        <div
          className={`w-fit px-3.5 py-1.5 ${
            message.sender === "user"
              ? "bg-gray-100 dark:bg-slate-700 rounded-t-2xl rounded-l-2xl ml-auto"
              : "dark:bg-amber-600/60 bg-amber-600/50 rounded-t-2xl rounded-r-2xl"
          }`}
        >
          <div
            className={`${
              message.sender === "user"
                ? "text-slate-900 dark:text-slate-100"
                : ""
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
        <span className="text-xs opacity-40">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}