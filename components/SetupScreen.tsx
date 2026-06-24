"use client";

import { useState } from "react";
import type { Difficulty } from "@/lib/prompts";

interface SetupScreenProps {
  onStart: (topic: string, difficulty: Difficulty, rounds: number) => void;
}

const difficulties: { id: Difficulty; label: string; desc: string }[] = [
  {
    id: "friendly",
    label: "Friendly",
    desc: "Civil pushback. Good for exploring ideas.",
  },
  {
    id: "socratic",
    label: "Socratic",
    desc: "Relentless questioning. Every claim must be defended.",
  },
  {
    id: "ruthless",
    label: "Ruthless",
    desc: "No mercy. Facts, stats, and zero concessions.",
  },
];

const exampleTopics = [
  "Social media does more harm than good",
  "Remote work makes people less productive",
  "College degrees are overrated",
  "AI will eliminate more jobs than it creates",
  "Pineapple belongs on pizza",
  "Democracy is the worst form of government, except for all the others",
];

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("socratic");
  const [rounds, setRounds] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onStart(topic.trim(), difficulty, rounds);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/50 border border-red-900/50 rounded-full text-xs text-red-400 uppercase tracking-widest font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            AI Debate Opponent
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            Debate Me
          </h1>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto">
            Type any opinion. The AI takes the opposite side and argues hard.
            Then it scores how well you did.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Your Position
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. &quot;Social media does more harm than good&quot;"
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-600/60 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-zinc-600 resize-none outline-none transition-colors"
            />
            {/* Examples */}
            <div className="mt-2 flex flex-wrap gap-2">
              {exampleTopics.slice(0, 3).map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setTopic(ex)}
                  className="text-xs px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-zinc-400 hover:text-zinc-200 transition-colors truncate max-w-[200px]"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    difficulty === d.id
                      ? "border-red-600 bg-red-950/30 text-white"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">{d.label}</p>
                  <p className="text-xs opacity-70 leading-snug">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Rounds */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Rounds{" "}
              <span className="text-zinc-600 normal-case font-normal">
                ({rounds} exchanges)
              </span>
            </label>
            <div className="flex gap-2">
              {[3, 5, 7].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRounds(r)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                    rounds === r
                      ? "border-red-600 bg-red-950/30 text-white"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!topic.trim()}
            className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-xl transition-all text-sm tracking-wide"
          >
            Start Debate →
          </button>
        </form>
      </div>
    </div>
  );
}
