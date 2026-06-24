"use client";

import { useState } from "react";
import SetupScreen from "@/components/SetupScreen";
import DebateArena, { type Message } from "@/components/DebateArena";
import ScoreCard, { type ScoreData } from "@/components/ScoreCard";
import Leaderboard, { saveToLeaderboard } from "@/components/Leaderboard";
import type { Difficulty } from "@/lib/prompts";

type Phase = "setup" | "debate" | "scoring" | "scored";

interface DebateState {
  topic: string;
  difficulty: Difficulty;
  rounds: number;
  messages: Message[];
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [debateState, setDebateState] = useState<DebateState | null>(null);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);

  function handleStart(topic: string, difficulty: Difficulty, rounds: number) {
    setDebateState({ topic, difficulty, rounds, messages: [] });
    setPhase("debate");
  }

  async function handleDebateComplete(messages: Message[]) {
    if (!debateState) return;
    setDebateState((prev) => (prev ? { ...prev, messages } : prev));
    setPhase("scoring");

    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPosition: debateState.topic,
        messages,
      }),
    });

    if (res.ok) {
      const score = await res.json();
      setScoreData(score);
      setPhase("scored");
    }
  }

  function handleSaveToLeaderboard(
    name: string,
    score: ScoreData,
    topic: string
  ) {
    saveToLeaderboard(name, score, topic);
  }

  function handleDebateAgain() {
    setPhase("setup");
    setDebateState(null);
    setScoreData(null);
  }

  return (
    <>
      {phase === "setup" && <SetupScreen onStart={handleStart} />}

      {phase === "debate" && debateState && (
        <DebateArena
          userPosition={debateState.topic}
          difficulty={debateState.difficulty}
          totalRounds={debateState.rounds}
          onDebateComplete={handleDebateComplete}
        />
      )}

      {phase === "scoring" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-500 text-sm">Analyzing your performance…</p>
          </div>
        </div>
      )}

      {phase === "scored" && scoreData && debateState && (
        <ScoreCard
          score={scoreData}
          topic={debateState.topic}
          onSaveToLeaderboard={handleSaveToLeaderboard}
          onDebateAgain={handleDebateAgain}
        />
      )}

      <Leaderboard visible={phase === "setup" || phase === "scored"} />
    </>
  );
}
