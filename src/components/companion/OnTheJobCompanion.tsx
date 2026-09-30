'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Copy, 
  Check, 
  Activity, 
  Smile, 
  ShieldCheck, 
  ArrowRight,
  Target,
  Zap,
  Coffee
} from 'lucide-react';
import { BragSheetEntry, BurnoutRadarState, UserProfile } from '@/lib/types';

interface OnTheJobCompanionProps {
  userProfile: UserProfile;
}

export function OnTheJobCompanion({ userProfile }: OnTheJobCompanionProps) {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'brag_sheet' | 'burnout_radar'>('blueprint');

  // 1. First 90 Days Blueprint State
  const [selectedPhase, setSelectedPhase] = useState<'30' | '60' | '90'>('30');

  // 2. Automated "Brag Sheet" Logger State
  const [bragEntries, setBragEntries] = useState<BragSheetEntry[]>([
    {
      id: 'brag_1',
      weekEnding: 'Sep 27, 2026',
      category: 'Architecture / PR',
      headline: 'Architected Idempotent Payment Retry Queue',
      quantifiableImpact: 'Prevented duplicate charges across 45,000 daily webhooks with zero packet loss.',
      stakeholders: ['Elena (Lead)', 'Marcus (FinOps)']
    },
    {
      id: 'brag_2',
      weekEnding: 'Sep 13, 2026',
      category: 'Cost Savings',
      headline: 'Redis Cluster Memory Overhaul & TTL Sweeper',
      quantifiableImpact: 'Reduced AWS ElastiCache spend by 32% ($14,200/mo saved) via intelligent eviction policies.',
      stakeholders: ['Sarah (VP Tech)', 'Cloud Infra Pod']
    },
    {
      id: 'brag_3',
      weekEnding: 'Aug 29, 2026',
      category: 'Cross-Team Mentorship',
      headline: 'Led Staff-Level Distributed Systems Brownbag Workshop',
      quantifiableImpact: 'Upskilled 24 engineers across 3 squads on Raft consensus and partition handling.',
      stakeholders: ['Core Platform Team']
    }
  ]);

  const [newHeadline, setNewHeadline] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [copiedBrag, setCopiedBrag] = useState(false);

  const handleAddBragEntry = () => {
    if (!newHeadline.trim()) return;
    const entry: BragSheetEntry = {
      id: `brag_${Date.now()}`,
      weekEnding: 'This week',
      category: 'Shipped Feature',
      headline: newHeadline.trim(),
      quantifiableImpact: newImpact.trim() || 'Accelerated production delivery and improved reliability.',
      stakeholders: ['Direct Manager', 'Squad Pod']
    };
    setBragEntries([entry, ...bragEntries]);
    setNewHeadline('');
    setNewImpact('');
  };

  const handleCopyBragSheet = () => {
    const text = bragEntries.map(e => `## [${e.weekEnding}] ${e.headline} (${e.category})\n- Impact: ${e.quantifiableImpact}\n- Key Stakeholders: ${e.stakeholders.join(', ')}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedBrag(true);
    setTimeout(() => setCopiedBrag(false), 2000);
  };

  // 3. Burnout & Imposter Sentiment Radar State
  const [burnoutState, setBurnoutState] = useState<BurnoutRadarState>({
    sentiment: 'Moderate Strain',
    score: 64,
    recommendedPacing: 'Strategic Recovery',
    indicators: [
      'Late-night git commits detected (02:40 AM pattern)',
      'Heightened self-critical vocabulary in recent interview answers',
      'Over-indexing on edge-case anxiety vs celebrating core strengths'
    ]
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)] overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="max-w-6xl mx-auto w-full mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                Pillar 6 • On-the-Job Longevity
              </span>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-blue-500" /> Career Retention, Impact & Well-being
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mt-1">
              On-the-Job Companion & Longevity
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Transform from candidate to high-impact leader: execute your First 90 Days Blueprint, log weekly brag sheets, and monitor burnout sentiment.
            </p>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex items-center bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'blueprint' ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              First 90 Days Blueprint
            </button>
            <button
              onClick={() => setActiveTab('brag_sheet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'brag_sheet' ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Weekly Brag Sheet
            </button>
            <button
              onClick={() => setActiveTab('burnout_radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'burnout_radar' ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Burnout & Sentiment Radar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full pb-12">
        
        {/* TAB 1: First 90 Days Blueprint */}
        {activeTab === 'blueprint' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-sm text-[var(--text-main)]">
                    First 90 Days Executive Onboarding Roadmap ({userProfile.targetRoles[0] || 'Staff Engineer'})
                  </h3>
                </div>
                <div className="flex gap-2">
                  {(['30', '60', '90'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPhase(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                        selectedPhase === p ? 'bg-emerald-600 text-white' : 'bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)]'
                      }`}
                    >
                      Days 1–{p}
                    </button>
                  ))}
                </div>
              </div>

              {selectedPhase === '30' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block">
                    Days 1–30: Listen, Map & Build Social Capital
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-semibold text-[var(--text-main)]">1. Stakeholder Listening Tour</div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Book 30-minute 1-on-1s with 8 adjacent engineering leads, Product Managers, and your EM. Ask: "What is the single biggest bottleneck your team faces today?"
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-semibold text-[var(--text-main)]">2. Codebase & Tooling Spelunking</div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Ship your first small bug fix or test improvement within day 7 to audit the CI/CD pipeline and release cadence firsthand.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-semibold text-[var(--text-main)]">3. Alignment Doc Creation</div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Summarize observed architectural risks and present a non-judgmental 3-page internal memo to your Director by Day 28.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPhase === '60' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block">
                    Days 31–60: Execute Quick Wins & Establish Technical Credibility
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-semibold text-[var(--text-main)]">1. Ship High-Visibility Initiative</div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Deliver a measurable optimization (e.g. shaving 200ms off p99 latency or fixing a notorious flaky end-to-end test suite).
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-semibold text-[var(--text-main)]">2. Author First Formal RFC</div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Write an architecture RFC proposing decoupled caching or idempotency rules. Build cross-squad consensus before the review meeting.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-semibold text-[var(--text-main)]">3. Pod Mentorship Rhythm</div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Start bi-weekly architectural office hours for mid-level engineers to establish peer mentorship and culture.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPhase === '90' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-wider block">
                    Days 61–90: Multi-Quarter Strategic Ownership & Executive Alignment
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-semibold text-[var(--text-main)]">1. Present Vision to VP of Tech</div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Co-present multi-quarter technical OKRs with Product leadership, showing direct ROI and system scalability.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-semibold text-[var(--text-main)]">2. Formal 90-Day Review Check-in</div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Review your Day-30 goals against actual deliverables with your manager to lock in an accelerated promotion trajectory.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                      <div className="font-semibold text-[var(--text-main)]">3. Self-Sustaining Squad Velocity</div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Delegate execution paths so team operations thrive without requiring your direct involvement in every code review.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Automated Brag Sheet Logger */}
        {activeTab === 'brag_sheet' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-[var(--text-main)]">
                    Continuous Performance Review Brag Sheet Logger
                  </h3>
                </div>
                <button
                  onClick={handleCopyBragSheet}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
                >
                  {copiedBrag ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedBrag ? 'Copied to Clipboard' : 'Export for Promo Packet'}
                </button>
              </div>

              {/* Quick Add Form */}
              <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3">
                <span className="text-xs font-semibold text-[var(--text-main)] block">Log This Week's Win:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Headline (e.g. Cut API p99 latency by 40%)"
                    value={newHeadline}
                    onChange={(e) => setNewHeadline(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Quantified metric or business outcome"
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleAddBragEntry}
                  disabled={!newHeadline.trim()}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to Brag Sheet
                </button>
              </div>

              {/* Entries List */}
              <div className="space-y-3">
                {bragEntries.map(entry => (
                  <div key={entry.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[var(--text-muted)] font-mono">{entry.weekEnding}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          {entry.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)]">Stakeholders: {entry.stakeholders.join(', ')}</span>
                    </div>
                    <div className="font-bold text-xs text-[var(--text-main)]">{entry.headline}</div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      💡 {entry.quantifiableImpact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Burnout & Imposter Sentiment Radar */}
        {activeTab === 'burnout_radar' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <h3 className="font-bold text-sm text-[var(--text-main)]">
                    Cognitive Sentiment & Burnout Radar
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {burnoutState.sentiment}
                </span>
              </div>

              {/* Stress Gauge Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Cognitive Fatigue Index</span>
                  <span className="font-mono font-bold text-amber-500">{burnoutState.score} / 100</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[var(--bg-main)] overflow-hidden border border-[var(--border-color)]">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500"
                    style={{ width: `${burnoutState.score}%` }}
                  />
                </div>
              </div>

              {/* Adaptive AI Coach Pacing Card */}
              <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
                    <Coffee className="w-4 h-4 text-amber-500" />
                    <span>Adaptive AI Coaching Shift: {burnoutState.recommendedPacing}</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-mono">Dynamic Pacing Engaged</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Apex detected signs of compounding cognitive strain and negative self-talk in your recent mock interview iterations. The coach has dialed down rapid-fire grilling and shifted toward reflective reinforcement, highlighting your top strengths in architecture while scheduling strategic rest.
                </p>
              </div>

              {/* Detected Indicators */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider block">
                  Observed Fatigue Signals:
                </span>
                <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                  {burnoutState.indicators.map((ind, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
