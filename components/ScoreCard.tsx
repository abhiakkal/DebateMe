"use client";

export interface ScoreData {
  overallScore: number;
  breakdown: {
    argumentStrength: number;
    evidenceQuality: number;
    responsiveness: number;
    composure: number;
  };
  strongestMoment: string;
  weakestMoment: string;
  missedOpportunity: string;
  verdict: string;
}

interface ScoreCardProps {
  score: ScoreData;
  topic: string;
  onSaveToLeaderboard: (name: string, score: ScoreData, topic: string) => void;
  onDebateAgain: () => void;
}

function ScoreBar({ value, label }: { value: number; label: string }) {
  const color =
    value >= 7
      ? "bg-emerald-500"
      : value >= 5
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1 text-gray-400">
        <span>{label}</span>
        <span className="font-mono">{value}/10</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({
  score,
  topic,
  onSaveToLeaderboard,
  onDebateAgain,
}: ScoreCardProps) {
  const scoreColor =
    score.overallScore >= 7
      ? "text-emerald-400"
      : score.overallScore >= 5
      ? "text-yellow-400"
      : "text-red-400";

  const scoreLabel =
    score.overallScore >= 8
      ? "Exceptional"
      : score.overallScore >= 7
      ? "Strong"
      : score.overallScore >= 6
      ? "Solid"
      : score.overallScore >= 5
      ? "Average"
      : score.overallScore >= 4
      ? "Weak"
      : "Demolished";

  const handleSave = () => {
    const name = prompt("Enter your name for the leaderboard:");
    if (name?.trim()) {
      onSaveToLeaderboard(name.trim(), score, topic);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-zinc-500 text-sm uppercase tracking-widest mb-2">
          Debate Over
        </p>
        <div className={`text-7xl font-black ${scoreColor} mb-1`}>
          {score.overallScore}
          <span className="text-3xl text-zinc-600">/10</span>
        </div>
        <p className={`text-xl font-semibold ${scoreColor}`}>{scoreLabel}</p>
        <p className="text-zinc-500 text-sm mt-2 max-w-md mx-auto italic">
          &ldquo;{topic}&rdquo;
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Breakdown
        </h3>
        <ScoreBar
          value={score.breakdown.argumentStrength}
          label="Argument Strength"
        />
        <ScoreBar
          value={score.breakdown.evidenceQuality}
          label="Evidence Quality"
        />
        <ScoreBar
          value={score.breakdown.responsiveness}
          label="Responsiveness"
        />
        <ScoreBar value={score.breakdown.composure} label="Composure" />
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="bg-zinc-900 border border-emerald-900/30 rounded-xl p-4">
          <p className="text-xs text-emerald-500 font-semibold uppercase tracking-wider mb-1">
            Strongest Moment
          </p>
          <p className="text-sm text-gray-300">{score.strongestMoment}</p>
        </div>
        <div className="bg-zinc-900 border border-red-900/30 rounded-xl p-4">
          <p className="text-xs text-red-500 font-semibold uppercase tracking-wider mb-1">
            Weakest Moment
          </p>
          <p className="text-sm text-gray-300">{score.weakestMoment}</p>
        </div>
        <div className="bg-zinc-900 border border-yellow-900/30 rounded-xl p-4">
          <p className="text-xs text-yellow-500 font-semibold uppercase tracking-wider mb-1">
            Missed Opportunity
          </p>
          <p className="text-sm text-gray-300">{score.missedOpportunity}</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-6">
        <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
          Verdict
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">{score.verdict}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-3 rounded-xl border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          Save to Leaderboard
        </button>
        <button
          onClick={onDebateAgain}
          className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white transition-colors"
        >
          Debate Again
        </button>
      </div>
    </div>
  );
}
