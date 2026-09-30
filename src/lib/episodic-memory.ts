/**
 * Vectorized Episodic Memory Engine
 * Simulates semantic embedding indexing and pgvector/Supabase hybrid memory.
 * Indexes past mock interviews, resume iterations, and negotiation notes
 * to provide contextual continuity across multi-day coaching sessions.
 */

import { EpisodicMemoryRecord } from './types';

const EPISODIC_STORAGE_KEY = 'apex_episodic_memory_v1';

const INITIAL_EPISODIC_RECORDS: EpisodicMemoryRecord[] = [
  {
    id: 'mem_1',
    timestamp: 'Yesterday, 14:32',
    topic: 'Staff System Design: Global Financial Ledger',
    sessionType: 'mock_interview',
    summary: 'Candidate demonstrated strong intuition on idempotency keys and two-phase commit, but stumbled on cross-datacenter Raft leader election latency.',
    similarityScore: 0.94,
    tags: ['System Design', 'Idempotency', 'Consensus', 'Staff Bar']
  },
  {
    id: 'mem_2',
    timestamp: '3 days ago, 19:15',
    topic: 'Resume Version 3.4 ATS Optimization',
    sessionType: 'resume_iteration',
    summary: 'Reframed microservices bullet point to include quantified business impact: reduced p99 latency from 450ms to 85ms across 12M daily requests.',
    similarityScore: 0.88,
    tags: ['Resume ATS', 'Quantified Metrics', 'Distributed Systems']
  },
  {
    id: 'mem_3',
    timestamp: 'Last week, 11:00',
    topic: 'Behavioral STAR: Cross-functional Technical Conflict',
    sessionType: 'mock_interview',
    summary: 'Candidate scored 8/10 on Action but gave low specificity in the Task phase. Recommended emphasizing explicit OKR alignment with Product Directors.',
    similarityScore: 0.82,
    tags: ['STAR Behavioral', 'Leadership', 'Conflict Resolution']
  }
];

export function getEpisodicMemories(): EpisodicMemoryRecord[] {
  if (typeof window === 'undefined') return INITIAL_EPISODIC_RECORDS;
  try {
    const raw = localStorage.getItem(EPISODIC_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EPISODIC_STORAGE_KEY, JSON.stringify(INITIAL_EPISODIC_RECORDS));
      return INITIAL_EPISODIC_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EPISODIC_RECORDS;
  }
}

export function saveEpisodicMemory(record: Omit<EpisodicMemoryRecord, 'id' | 'timestamp' | 'similarityScore'>): EpisodicMemoryRecord {
  const memories = getEpisodicMemories();
  const newRecord: EpisodicMemoryRecord = {
    ...record,
    id: `mem_${Date.now()}`,
    timestamp: 'Just now',
    similarityScore: 0.95
  };
  const updated = [newRecord, ...memories];
  if (typeof window !== 'undefined') {
    localStorage.setItem(EPISODIC_STORAGE_KEY, JSON.stringify(updated));
  }
  return newRecord;
}

export function searchEpisodicMemory(query: string): EpisodicMemoryRecord[] {
  const records = getEpisodicMemories();
  if (!query.trim()) return records;

  const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return records.map(record => {
    let matches = 0;
    const combined = `${record.topic} ${record.summary} ${record.tags.join(' ')}`.toLowerCase();
    for (const term of queryTerms) {
      if (combined.includes(term)) matches++;
    }
    const score = queryTerms.length > 0 ? Math.min(0.99, 0.5 + (matches / queryTerms.length) * 0.49) : 0.8;
    return { ...record, similarityScore: Number(score.toFixed(2)) };
  }).sort((a, b) => b.similarityScore - a.similarityScore);
}
