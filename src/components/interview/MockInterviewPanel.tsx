import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  Award, 
  Flame, 
  BookOpen, 
  ExternalLink,
  Target
} from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { getResourcesForRole } from '@/lib/resources';

interface MockInterviewPanelProps {
  userProfile: UserProfile;
  onSendPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export function MockInterviewPanel({
  userProfile,
  onSendPrompt,
  isLoading,
}: MockInterviewPanelProps) {
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [difficulty, setDifficulty] = useState<'Standard' | 'Rigorous' | 'FAANG Bar-Raiser'>('FAANG Bar-Raiser');
  const [questionCategory, setQuestionCategory] = useState<'Behavioral (STAR)' | 'System Design' | 'Leadership / Conflict' | 'Executive Presence'>('Behavioral (STAR)');
  const [showResources, setShowResources] = useState(false);

  const targetRole = userProfile.targetRoles?.[0] || 'Staff Software Engineer';
  const studyResources = getResourcesForRole(targetRole, userProfile.keySkills);

  // Timer counter
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartInterview = (category: string) => {
    setSeconds(0);
    setIsTimerRunning(true);
    onSendPrompt(
      `Start Question 1 of our 3-question Mock Interview round for the role of "${targetRole}" in category "${category}" (${difficulty} difficulty). Ask Question 1 clearly and hold all scoring/evaluation until all 3 questions are completed.`
    );
  };

  const handleFinishAndReport = () => {
    onSendPrompt(
      `I have completed my interview answers. Please wrap up the interview and provide my Comprehensive Interview Results & Performance Report for the role of "${targetRole}". Include:
1. Overall candidate score (1-10) and Bar-Raiser hiring recommendation
2. Detailed question-by-question breakdown of my answers with STAR scores
3. Strengths and critical improvement suggestions
4. Apex benchmark model answers for each question
5. Curated clickable YouTube study tutorials and practice testing links tailored to ${targetRole}.`
    );
  };

  return (
    <div className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] p-3 sm:p-4 text-xs space-y-3 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Role and Mode */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-bold shadow-sm">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--text-main)]">Live Mock Interview Simulator</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-main)] font-medium">
                {difficulty}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Target Role: <strong className="text-[var(--text-main)]">{targetRole}</strong> • Sequential Questions (Results at end)
            </p>
          </div>
        </div>

        {/* Center: Timer & Controls */}
        <div className="flex items-center gap-2 bg-[var(--bg-main)] px-3 py-1.5 rounded-xl border border-[var(--border-color)] shadow-sm">
          <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="font-mono font-bold text-[var(--text-main)] text-sm">
            {formatTime(seconds)}
          </span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded ml-1"
            title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
          >
            {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setSeconds(0)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded"
            title="Reset timer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Triggers */}
        <div className="flex items-center gap-1.5">
          <button
            disabled={isLoading}
            onClick={() => handleStartInterview(questionCategory)}
            className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface-hover)] hover:border-[var(--border-color)] border border-transparent text-xs text-[var(--text-main)] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Start new question round"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Round (Q1/3)</span>
          </button>

          <button
            disabled={isLoading}
            onClick={handleFinishAndReport}
            className="px-3 py-1.5 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            title="Calculate final interview evaluation report"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Finish & Get Results</span>
          </button>

          <button
            onClick={() => setShowResources(!showResources)}
            className="p-1.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="Toggle Recommended YouTube & Practice Links"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Focus Category Selector */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[var(--border-color)]">
        <span className="text-[11px] text-[var(--text-muted)] mr-1">Interview Category:</span>
        {(['Behavioral (STAR)', 'System Design', 'Leadership / Conflict', 'Executive Presence'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setQuestionCategory(cat);
              handleStartInterview(cat);
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              questionCategory === cat
                ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold shadow-sm'
                : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Curated YouTube & Practice Sites Dropdown Drawer */}
      {showResources && (
        <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-[var(--text-main)] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Curated Study & Practice Hub for {targetRole}
            </span>
            <button
              onClick={() => setShowResources(false)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {studyResources.slice(0, 6).map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-start justify-between group transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[11px] text-[var(--text-main)] group-hover:underline">
                      {res.title}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-muted)] uppercase">
                      {res.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                    {res.description}
                  </p>
                </div>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--text-main)] shrink-0 ml-1 mt-0.5" />
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
