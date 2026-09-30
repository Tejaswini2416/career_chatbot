'use client';

import React, { useState } from 'react';
import { 
  Trello, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Building, 
  DollarSign, 
  MapPin, 
  Sparkles, 
  Mail, 
  ChevronRight, 
  AlertCircle,
  Chrome,
  Calendar,
  X,
  Send
} from 'lucide-react';
import { JobApplicationCard, ApplicationStage, PostInterviewDebrief, UserProfile } from '@/lib/types';

interface ApplicationKanbanProps {
  userProfile: UserProfile;
}

const STAGES: { key: ApplicationStage; label: string; color: string }[] = [
  { key: 'wishlist', label: 'Wishlist (Target)', color: 'text-slate-400' },
  { key: 'applied', label: 'Applied', color: 'text-blue-500' },
  { key: 'screening', label: 'Recruiter Screen', color: 'text-amber-500' },
  { key: 'tech_rounds', label: 'Technical / System Design', color: 'text-purple-500' },
  { key: 'offer', label: 'Offer Received', color: 'text-emerald-500' },
  { key: 'rejected', label: 'Archived', color: 'text-red-400' },
];

export function ApplicationKanban({ userProfile }: ApplicationKanbanProps) {
  const [applications, setApplications] = useState<JobApplicationCard[]>([
    {
      id: 'app_1',
      company: 'Stripe',
      role: 'Staff Software Engineer',
      salary: '$240k - $285k Base',
      location: 'San Francisco, CA',
      stage: 'tech_rounds',
      appliedDate: 'Sep 18, 2026',
      hiringManager: 'Elena Rostova (Dir of Core Eng)',
      notes: 'Passed behavioral screen. System Design round scheduled for Thursday 14:00 UTC.',
      nextStep: 'Prepare Raft consensus & cross-region failover prep.'
    },
    {
      id: 'app_2',
      company: 'Datadog',
      role: 'Staff Infrastructure Architect',
      salary: '$230k - $270k Base',
      location: 'Remote (US)',
      stage: 'screening',
      appliedDate: 'Sep 22, 2026',
      hiringManager: 'Marcus Vance',
      notes: 'Recruiter emphasized eBPF and telemetry data pipeline experience.',
      nextStep: 'Screening call completed. Waiting on hiring manager feedback.'
    },
    {
      id: 'app_3',
      company: 'Airbnb',
      role: 'Staff Full Stack Engineer',
      salary: '$245k Base + $220k Equity',
      location: 'San Francisco, CA',
      stage: 'offer',
      appliedDate: 'Aug 29, 2026',
      hiringManager: 'Sarah Chen (VP Tech)',
      notes: 'Official written offer received. Reviewing 4-year vesting schedule and counter-offer targets.',
      nextStep: 'Schedule compensation negotiation call.'
    },
    {
      id: 'app_4',
      company: 'Scale AI',
      role: 'Principal Platform Engineer',
      salary: '$260k Base',
      location: 'San Francisco, CA',
      stage: 'wishlist',
      appliedDate: 'Pending referral',
      hiringManager: 'David K.',
      notes: 'Reached out to 1st-degree connection for internal referral.',
      nextStep: 'Follow up on referral submission.'
    }
  ]);

  // Modals
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showDebriefModal, setShowDebriefModal] = useState(false);
  const [selectedAppForDebrief, setSelectedAppForDebrief] = useState<JobApplicationCard | null>(null);

  // Debrief Workflow State
  const [debriefQuestions, setDebriefQuestions] = useState<string>(
    '1. Design a multi-tenant rate limiter with sub-5ms Redis latency\n2. How did you resolve an architectural disagreement with Product?'
  );
  const [generatedDebrief, setGeneratedDebrief] = useState<PostInterviewDebrief | null>(null);

  const handleMoveStage = (id: string, newStage: ApplicationStage) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, stage: newStage } : app));
  };

  const handleGenerateDebrief = () => {
    if (!selectedAppForDebrief) return;
    setGeneratedDebrief({
      company: selectedAppForDebrief.company,
      role: selectedAppForDebrief.role,
      interviewType: 'System Design & Leadership',
      questionsAsked: debriefQuestions.split('\n').filter(Boolean),
      knowledgeGapsIdentified: [
        'Could have elaborated on Redis Cluster slot migration mechanics during resharding.',
        'Good executive clarity on product deadlock negotiation.'
      ],
      customThankYouNote: `Hi ${selectedAppForDebrief.hiringManager || 'Hiring Team'},\n\nThank you for taking the time to speak with me today regarding the ${selectedAppForDebrief.role} role at ${selectedAppForDebrief.company}. I thoroughly enjoyed diving into distributed rate-limiting and cross-squad architecture trade-offs.\n\nOur conversation reinforced my excitement about the scale your squad is tackling. Please let me know if you need any additional system design docs or technical references from my past projects.\n\nBest regards,\n${userProfile.fullName}`,
      debriefGeneratedAt: 'Within 2 hours of interview completion'
    });
  };

  const handleSimulateChromeClip = () => {
    const newCard: JobApplicationCard = {
      id: `app_${Date.now()}`,
      company: 'Anthropic',
      role: 'Member of Technical Staff (Platform)',
      salary: '$250k - $310k Base + Equity',
      location: 'San Francisco, CA',
      stage: 'applied',
      appliedDate: 'Just now',
      hiringManager: 'Clara Oswald',
      notes: 'Auto-clipped via Apex Chrome Extension from Greenhouse job portal.',
      nextStep: 'Prepare AI agent safety architecture talking points.'
    };
    setApplications(prev => [newCard, ...prev]);
    setShowExtensionModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)] overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto w-full mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Pillar 4 • Opportunity Tracking
              </span>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Trello className="w-3.5 h-3.5 text-blue-500" /> End-to-End Kanban & Debrief Workflows
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mt-1">
              Application Lifecycle & Opportunity Pipeline
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Track job stages, auto-clip postings via the Chrome extension, and generate rapid 2-hour post-interview debriefs and thank-you notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExtensionModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-main)] shadow-xs transition-colors"
            >
              <Chrome className="w-3.5 h-3.5 text-blue-500" /> Clip via Chrome Extension
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="max-w-7xl mx-auto w-full pb-12 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 min-w-[1100px]">
          {STAGES.map(stage => {
            const cardsInStage = applications.filter(a => a.stage === stage.key);
            return (
              <div key={stage.key} className="flex flex-col rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-3 min-h-[480px]">
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5 mb-3 px-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${stage.color}`}>
                    {stage.label}
                  </span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)]">
                    {cardsInStage.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-3">
                  {cardsInStage.map(card => (
                    <div
                      key={card.id}
                      className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] hover:border-blue-500/50 transition-all shadow-xs space-y-2 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-xs text-[var(--text-main)]">{card.company}</div>
                          <div className="text-[11px] text-[var(--text-muted)]">{card.role}</div>
                        </div>
                        {card.stage === 'offer' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                            OFFER
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-mono text-emerald-500">
                        {card.salary}
                      </div>

                      {card.nextStep && (
                        <div className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-surface)] p-2 rounded-lg border border-[var(--border-color)]/60">
                          <span className="font-semibold text-[var(--text-main)] block mb-0.5">Next Action:</span>
                          {card.nextStep}
                        </div>
                      )}

                      {/* Card Action Bar */}
                      <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => {
                            setSelectedAppForDebrief(card);
                            setShowDebriefModal(true);
                          }}
                          className="text-blue-500 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Mail className="w-3 h-3" /> Debrief & Note
                        </button>

                        <select
                          value={card.stage}
                          onChange={(e: any) => handleMoveStage(card.id, e.target.value)}
                          className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]"
                        >
                          {STAGES.map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {cardsInStage.length === 0 && (
                    <div className="h-28 rounded-xl border border-dashed border-[var(--border-color)] flex items-center justify-center text-xs text-[var(--text-muted)]">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chrome Extension Modal Simulator */}
      {showExtensionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Chrome className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm text-[var(--text-main)]">Apex 1-Click Chrome Extension Importer</h3>
              </div>
              <button onClick={() => setShowExtensionModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs space-y-1.5 font-mono">
              <div className="text-[var(--text-muted)]">Detected Job Posting on Active Tab:</div>
              <div className="font-semibold text-emerald-500">Anthropic — Member of Technical Staff (Platform)</div>
              <div className="text-[var(--text-muted)]">Target Compensation: $250k - $310k Base + Equity</div>
              <div className="text-[var(--text-muted)]">Hiring Team: Clara Oswald (Platform Lead)</div>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              This extension clips job requirements, salary bands, and team members directly into your active Kanban application funnel with zero manual data entry.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
              <button
                onClick={() => setShowExtensionModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateChromeClip}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-xs"
              >
                Import to Kanban Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Interview Debrief & Thank-You Workflow Modal */}
      {showDebriefModal && selectedAppForDebrief && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-[var(--text-main)]">
                  Automated Post-Interview Debrief ({selectedAppForDebrief.company})
                </h3>
              </div>
              <button onClick={() => setShowDebriefModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--text-main)] block">
                Interview Questions Asked (Record while fresh in mind):
              </label>
              <textarea
                value={debriefQuestions}
                onChange={(e) => setDebriefQuestions(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleGenerateDebrief}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Generate 2-Hour Thank-You Note & Gap Analysis
            </button>

            {generatedDebrief && (
              <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
                <div className="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block">
                    Customized Thank-You Note (Send to {selectedAppForDebrief.hiringManager}):
                  </span>
                  <pre className="text-xs font-sans text-[var(--text-main)] whitespace-pre-wrap leading-relaxed">
                    {generatedDebrief.customThankYouNote}
                  </pre>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 space-y-1">
                  <span className="font-semibold block">Round-Two Knowledge Gaps to Bridge:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {generatedDebrief.knowledgeGapsIdentified.map((gap, i) => (
                      <li key={i}>{gap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
