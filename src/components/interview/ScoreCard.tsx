import React, { useState } from 'react';
import { StarFeedback } from '@/lib/types';
import { Award, CheckCircle, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ScoreCardProps {
  feedback: StarFeedback;
}

export function ScoreCard({ feedback }: ScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
    if (score >= 7) return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    return 'text-red-400 border-red-500/40 bg-red-950/30';
  };

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900/90 overflow-hidden shadow-lg transition-all">
      {/* Header bar */}
      <div 
        className="p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border-b border-slate-800 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                STAR Framework Evaluation
              </span>
              <Badge variant="warning" className="text-[10px] py-0 px-1.5">
                Score: {feedback.overall}/10
              </Badge>
            </div>
            <p className="text-[10px] text-slate-400">
              Competency: {feedback.competency || 'Leadership & Technical Execution'}
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-400 hover:text-white">
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </Button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* STAR 4-Pillar Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Situation', score: feedback.situation, desc: 'Context & Scale' },
              { label: 'Task', score: feedback.task, desc: 'Scope & Mandate' },
              { label: 'Action', score: feedback.action, desc: 'Technical Rigor' },
              { label: 'Result', score: feedback.result, desc: 'Measurable ROI' },
            ].map((pillar) => (
              <div
                key={pillar.label}
                className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center ${getScoreColor(
                  pillar.score
                )}`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {pillar.label}
                </span>
                <span className="text-base font-extrabold mt-0.5">{pillar.score}/10</span>
                <span className="text-[9px] text-slate-400 mt-0.5">{pillar.desc}</span>
              </div>
            ))}
          </div>

          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Key Strengths Observed</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                {feedback.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 text-xs leading-none mt-1">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Areas to Elevate (Staff Bar)</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                {feedback.growthAreas.map((g, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 text-xs leading-none mt-1">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Apex Answer */}
          {feedback.apexSampleAnswer && (
            <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-[11px]">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                <span>Apex Model Answer Benchmark</span>
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "{feedback.apexSampleAnswer}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
