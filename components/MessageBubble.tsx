"use client";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function MessageBubble({
  role,
  content,
  isStreaming,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-900 border border-red-700 flex items-center justify-center mr-3 mt-1">
          <span className="text-xs font-bold text-red-300">AI</span>
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-zinc-800 border border-zinc-700 text-gray-100 rounded-tr-sm"
            : "bg-zinc-900 border border-red-900/40 text-gray-200 rounded-tl-sm"
        } ${isStreaming ? "typing-cursor" : ""}`}
      >
        {content || (isStreaming ? "" : "…")}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center ml-3 mt-1">
          <span className="text-xs font-bold text-zinc-300">You</span>
        </div>
      )}
    </div>
  );
}
