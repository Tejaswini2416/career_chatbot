import React from 'react';
import { CheckCircle2, XCircle, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface AtsScoreCardProps {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  onAddKeywordToPrompt?: (kw: string) => void;
}

export function AtsScoreCard({
  score,
  matchedKeywords,
  missingKeywords,
  onAddKeywordToPrompt,
}: AtsScoreCardProps) {
  const getScoreColor = () => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    return 'text-red-400 border-red-500/30 bg-red-950/20';
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">
              ATS Keyword Match Index
            </h4>
            <p className="text-[10px] text-slate-400">
              Scanned against your target skills profile
            </p>
          </div>
        </div>

        {/* Score Ring */}
        <div className={`px-3 py-1 rounded-full border text-xs font-bold ${getScoreColor()}`}>
          {score}% ATS Match
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            score >= 85 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Matched Keywords */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Matched Keywords ({matchedKeywords.length})
        </span>
        <div className="flex flex-wrap gap-1">
          {matchedKeywords.map((kw) => (
            <span
              key={kw}
              className="px-2 py-0.5 rounded bg-emerald-950/50 text-[10px] font-medium text-emerald-300 border border-emerald-800/40"
            >
              ✓ {kw}
            </span>
          ))}
          {matchedKeywords.length === 0 && (
            <span className="text-[10px] text-slate-400 italic">No target keywords matched yet.</span>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      {missingKeywords.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Recommended ATS Additions ({missingKeywords.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {missingKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => onAddKeywordToPrompt?.(kw)}
                title="Click to ask Apex to weave this keyword in"
                className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-medium text-amber-300/90 border border-amber-900/40 hover:border-amber-500/60 hover:bg-amber-950/40 transition-all flex items-center gap-1 group"
              >
                <span>+ {kw}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
