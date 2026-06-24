"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import type { Difficulty } from "@/lib/prompts";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DebateArenaProps {
  userPosition: string;
  difficulty: Difficulty;
  totalRounds: number;
  onDebateComplete: (messages: Message[]) => void;
}

export default function DebateArena({
  userPosition,
  difficulty,
  totalRounds,
  onDebateComplete,
}: DebateArenaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentRound, setCurrentRound] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [debateOver, setDebateOver] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startedRef = useRef(false);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, streamingContent]);

  // Kick off round 1 — AI goes first. The ref guard prevents StrictMode double-fire.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startRound(1, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startRound(round: number, history: Message[]) {
    setCurrentRound(round);
    setIsStreaming(true);
    setStreamingContent("");

    const messagesToSend =
      history.length === 0
        ? [
            {
              role: "user" as const,
              content: `The topic is: "${userPosition}". Open the debate by taking the opposing side.`,
            },
          ]
        : history;

    const res = await fetch("/api/debate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPosition,
        difficulty,
        messages: messagesToSend,
        round,
        totalRounds,
      }),
    });

    if (!res.ok || !res.body) {
      setIsStreaming(false);
      setApiError("Failed to connect to the debate API. Check the server.");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      full += chunk;
      setStreamingContent(full);
    }

    if (full.startsWith("__ERROR__:")) {
      const errMsg = full.slice("__ERROR__:".length);
      setIsStreaming(false);
      setStreamingContent("");
      setApiError(errMsg.includes("credit balance")
        ? "Your Anthropic account has no credits. Add credits at console.anthropic.com → Plans & Billing."
        : errMsg);
      return;
    }

    const aiMessage: Message = { role: "assistant", content: full };

    setMessages((prev) => {
      // For round 1 the prompt message wasn't added, just the AI response
      if (history.length === 0) return [aiMessage];
      return [...prev, aiMessage];
    });
    setStreamingContent("");
    setIsStreaming(false);

    if (round >= totalRounds) {
      setDebateOver(true);
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || isStreaming || debateOver) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setInput("");

    const nextRound = currentRound + 1;
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    startRound(nextRound, updatedMessages);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const userRoundsLeft = totalRounds - currentRound;
  const progressPct = (currentRound / totalRounds) * 100;

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              Live Debate
            </span>
          </div>
          <span className="text-xs text-zinc-600 font-mono">
            Round {Math.min(currentRound, totalRounds)}/{totalRounds}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-px bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="mt-2 mb-1">
          <p className="text-xs text-zinc-600 truncate">
            <span className="text-zinc-500">Your position:</span>{" "}
            &ldquo;{userPosition}&rdquo;
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {isStreaming && (
          <MessageBubble
            role="assistant"
            content={streamingContent}
            isStreaming
          />
        )}

        {debateOver && !isStreaming && (
          <div className="text-center py-6">
            <p className="text-zinc-500 text-sm">Debate complete.</p>
            <button
              onClick={() => onDebateComplete(messages)}
              className="mt-4 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              See My Score →
            </button>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* API error banner */}
      {apiError && (
        <div className="flex-shrink-0 mx-4 mb-3 px-4 py-3 bg-red-950/60 border border-red-800 rounded-xl text-sm text-red-300">
          <span className="font-semibold text-red-400">Error: </span>
          {apiError}
        </div>
      )}

      {/* Input */}
      {!debateOver && (
        <div className="flex-shrink-0 px-4 pb-4">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming || currentRound === 0}
              placeholder={
                isStreaming
                  ? "AI is thinking…"
                  : userRoundsLeft <= 0
                  ? "Debate over"
                  : "Your argument… (Enter to send, Shift+Enter for new line)"
              }
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-600/50 rounded-xl px-4 py-3 pr-14 text-sm text-gray-100 placeholder-zinc-600 resize-none outline-none transition-colors disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="absolute right-3 bottom-3 w-8 h-8 bg-red-600 hover:bg-red-500 disabled:bg-zinc-700 disabled:opacity-50 rounded-lg flex items-center justify-center transition-all"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
