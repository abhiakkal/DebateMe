"use client";

import { useEffect, useState } from "react";
import type { ScoreData } from "./ScoreCard";

export interface LeaderboardEntry {
  id: string;
  name: string;
  topic: string;
  score: number;
  date: string;
}

const STORAGE_KEY = "debateme_leaderboard";

export function saveToLeaderboard(
  name: string,
  scoreData: ScoreData,
  topic: string
) {
  const entries: LeaderboardEntry[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );
  const newEntry: LeaderboardEntry = {
    id: Date.now().toString(),
    name,
    topic,
    score: scoreData.overallScore,
    date: new Date().toLocaleDateString(),
  };
  entries.push(newEntry);
  entries.sort((a, b) => b.score - a.score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 50)));
}

export default function Leaderboard({ visible }: { visible: boolean }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setEntries(stored);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-all shadow-lg"
      >
        <span>🏆</span>
        <span>Leaderboard</span>
      </button>

      {open && (
        <div className="absolute bottom-12 right-0 w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-white">Top Debaters</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-zinc-500 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {entries.length === 0 ? (
              <p className="text-center text-zinc-600 text-sm py-8">
                No scores yet. Win a debate!
              </p>
            ) : (
              entries.slice(0, 20).map((entry, i) => (
                <div
                  key={entry.id}
                  className="px-4 py-3 border-b border-zinc-800/50 flex items-center gap-3 hover:bg-zinc-800/30"
                >
                  <span
                    className={`text-xs font-mono w-5 text-center ${
                      i === 0
                        ? "text-yellow-400"
                        : i === 1
                        ? "text-zinc-300"
                        : i === 2
                        ? "text-amber-600"
                        : "text-zinc-600"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {entry.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {entry.topic}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        entry.score >= 7
                          ? "text-emerald-400"
                          : entry.score >= 5
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {entry.score}/10
                    </p>
                    <p className="text-xs text-zinc-600">{entry.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
