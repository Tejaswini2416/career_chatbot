import React, { useState } from 'react';
import { 
  TrendingUp, 
  Map, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  ExternalLink,
  Target,
  Video,
  Code
} from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { getResourcesForRole } from '@/lib/resources';

interface SkillGapRoadmapProps {
  userProfile: UserProfile;
  onSendPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export function SkillGapRoadmap({
  userProfile,
  onSendPrompt,
  isLoading,
}: SkillGapRoadmapProps) {
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    'm1_1': true,
    'm1_2': false,
    'm2_1': false,
  });

  const toggleMilestone = (id: string) => {
    setCompletedMilestones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const targetRole = userProfile.targetRoles?.[0] || 'Staff Software Engineer';
  const resources = getResourcesForRole(targetRole, userProfile.keySkills);
  const youtubeResources = resources.filter(r => r.type === 'youtube');
  const practiceResources = resources.filter(r => r.type === 'practice' || r.type === 'test' || r.type === 'roadmap');

  const competencies = [
    { name: 'System Architecture & Scalability', current: 85, target: 95, status: 'Near Target' },
    { name: 'Cross-Team Technical Governance (ADRs)', current: 65, target: 90, status: 'High Priority Gap' },
    { name: 'Executive Presence & VP Communication', current: 60, target: 88, status: 'High Priority Gap' },
    { name: 'Cost Optimization & Capacity Planning', current: 75, target: 85, status: 'Moderate Gap' },
    { name: 'Engineering Mentorship & Talent Pipeline', current: 80, target: 90, status: 'On Track' },
  ];

  const milestones = [
    {
      phase: 'Month 1 (Days 1–30)',
      title: 'Foundation & Organizational Visibility',
      tasks: [
        { id: 'm1_1', text: 'Identify high-friction system bottleneck across squad boundaries' },
        { id: 'm1_2', text: 'Draft Architecture Decision Record (ADR) and present in Engineering Guild' },
        { id: 'm1_3', text: 'Establish bi-weekly 1-on-1 mentorship sessions with 2 junior/mid engineers' },
      ]
    },
    {
      phase: 'Month 2 (Days 31–60)',
      title: 'Execution & Metric Attribution',
      tasks: [
        { id: 'm2_1', text: 'Ship the core ADR platform service with 99.99% reliability SLA' },
        { id: 'm2_2', text: 'Quantify latency and cloud savings ($100k+ ARR / 70% p99 improvement)' },
        { id: 'm2_3', text: 'Deliver internal Tech Talk to 40+ engineering org members' },
      ]
    },
    {
      phase: 'Month 3 (Days 61–90)',
      title: 'Staff Promotion Case & Target Role Offers',
      tasks: [
        { id: 'm3_1', text: 'Compile comprehensive Staff Engineer Brag Sheet & Sponsor Endorsements' },
        { id: 'm3_2', text: 'Execute 5 rigorous mock interview sessions (STAR & System Design)' },
        { id: 'm3_3', text: 'Conduct promotion calibration meeting with VP / Director of Engineering' },
      ]
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-w-5xl mx-auto text-[var(--text-main)]">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--text-main)]">
                Career Roadmap & Skill Radar
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-main)] font-medium">
                Target: {targetRole}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Current: <strong className="text-[var(--text-main)]">{userProfile.currentRole}</strong> ({userProfile.yearsOfExperience} YOE) ➔ Elevating to Top 5% Industry Bar.
            </p>
          </div>
        </div>

        <button
          disabled={isLoading}
          onClick={() => onSendPrompt(`Please perform a deep-dive skill benchmark comparing my current ${userProfile.yearsOfExperience} years experience in ${userProfile.currentRole} with top tier requirements for ${targetRole}. Detail high-priority gap areas and action steps.`)}
          className="px-3 py-1.5 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Refresh AI Benchmark</span>
        </button>
      </div>

      {/* Competency Gap Radar */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4">
        <h3 className="font-semibold text-xs text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-4 h-4" />
          Competency Gap Breakdown vs {targetRole}
        </h3>

        <div className="space-y-3">
          {competencies.map((comp) => (
            <div key={comp.name} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[var(--text-main)]">{comp.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Current: <strong>{comp.current}%</strong> | Target: <strong>{comp.target}%</strong>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    comp.status.includes('High') 
                      ? 'bg-rose-950/20 text-rose-400 border-rose-500/30' 
                      : 'bg-[var(--bg-surface-hover)] text-[var(--text-main)] border-[var(--border-color)]'
                  }`}>
                    {comp.status}
                  </span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="w-full bg-[var(--bg-main)] h-2 rounded-full overflow-hidden relative border border-[var(--border-color)]">
                <div
                  className="h-full bg-[var(--bg-accent)] rounded-full transition-all duration-500"
                  style={{ width: `${comp.current}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-60-90 Day Execution Milestones */}
      <div className="space-y-3">
        <h3 className="font-semibold text-xs text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
          <Map className="w-4 h-4" />
          30-60-90 Day Milestone Execution Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {milestones.map((m) => (
            <div
              key={m.phase}
              className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-wider">
                    {m.phase}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-color)]">
                    Stage
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[var(--text-main)] leading-snug">
                  {m.title}
                </h4>

                <ul className="space-y-2 pt-2">
                  {m.tasks.map((t) => {
                    const isDone = completedMilestones[t.id];
                    return (
                      <li
                        key={t.id}
                        onClick={() => toggleMilestone(t.id)}
                        className="flex items-start gap-2 text-xs text-[var(--text-muted)] cursor-pointer select-none hover:text-[var(--text-main)] transition-colors"
                      >
                        <button className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-zinc-500" />
                          )}
                        </button>
                        <span className={isDone ? 'line-through opacity-50' : ''}>
                          {t.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                disabled={isLoading}
                onClick={() => onSendPrompt(`Give me the exact step-by-step blueprint and template to execute on: "${m.title}" for a ${targetRole} trajectory.`)}
                className="w-full py-1.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs text-[var(--text-main)] hover:border-[var(--text-main)] flex items-center justify-center gap-1 transition-colors mt-2"
              >
                <span>Drill Down in Chat</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended YouTube Courses & Practice Websites */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4">
        <h3 className="font-semibold text-xs text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          Recommended Study, Practice & Testing Resources
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Curated external channels, test platforms, and interactive roadmaps tailored specifically for <strong>{targetRole}</strong>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {resources.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-[var(--bg-main)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-start justify-between group transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[var(--text-main)] group-hover:underline">
                    {item.title}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] uppercase">
                    {item.type}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-main)] shrink-0 ml-2 mt-0.5" />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
