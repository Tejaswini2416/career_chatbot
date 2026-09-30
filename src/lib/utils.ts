import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GeneratedDocument, StarFeedback, UserProfile } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateProfileCompleteness(profile: UserProfile): number {
  let score = 0;
  if (profile.fullName?.trim()) score += 10;
  if (profile.currentRole?.trim()) score += 15;
  if (profile.experienceLevel) score += 10;
  if (profile.keySkills && profile.keySkills.length >= 3) score += 15;
  if (profile.targetRoles && profile.targetRoles.length >= 1) score += 15;
  if (profile.shortTermGoals?.trim()) score += 10;
  if (profile.longTermGoals?.trim()) score += 10;
  if (profile.resumeText && profile.resumeText.trim().length > 50) score += 15;
  return Math.min(score, 100);
}

export function parseStarFeedbackFromText(text: string): StarFeedback | undefined {
  try {
    const hasSituation = /situation/i.test(text);
    const hasAction = /action/i.test(text);
    const hasResult = /result/i.test(text);

    if (!hasSituation || !hasAction || !hasResult) {
      return undefined;
    }

    const extractScore = (keyword: string, fallback: number = 8): number => {
      const regex = new RegExp(`${keyword}[^\\n0-9]*(\\d{1,2})\\s*(?:/|out of)?\\s*10`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        const val = parseInt(match[1], 10);
        return isNaN(val) ? fallback : Math.min(Math.max(val, 1), 10);
      }
      return fallback;
    };

    const situation = extractScore('Situation', 8);
    const task = extractScore('Task', 8);
    const action = extractScore('Action', 9);
    const result = extractScore('Result', 7);
    const overall = Math.round((situation + task + action + result) / 4);

    const strengths: string[] = [];
    const strengthMatch = text.match(/(?:strengths|strong points|what went well)[\s\S]*?(?:growth|improvements|critical misses|apex sample|score|$)/i);
    if (strengthMatch) {
      const lines = strengthMatch[0].split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•') || /^\d+\./.test(l.trim()));
      lines.slice(0, 3).forEach(l => strengths.push(l.replace(/^[-•\d.]\s*/, '').trim()));
    }
    if (strengths.length === 0) {
      strengths.push('Clear problem framing and technical context', 'Demonstrated proactive leadership');
    }

    const growthAreas: string[] = [];
    const growthMatch = text.match(/(?:growth areas|improvements|critical misses|areas to sharpen)[\s\S]*?(?:apex sample|improved answer|follow-up|$)/i);
    if (growthMatch) {
      const lines = growthMatch[0].split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•') || /^\d+\./.test(l.trim()));
      lines.slice(0, 3).forEach(l => growthAreas.push(l.replace(/^[-•\d.]\s*/, '').trim()));
    }
    if (growthAreas.length === 0) {
      growthAreas.push('Quantify the business and latency metrics more explicitly', 'Highlight cross-functional alignment trade-offs');
    }

    let apexSampleAnswer = '';
    const sampleMatch = text.match(/(?:apex sample answer|improved answer|model answer|tier-1 response):?([\s\S]*?)(?:follow-up|next question|$)/i);
    if (sampleMatch && sampleMatch[1]) {
      apexSampleAnswer = sampleMatch[1].trim().slice(0, 700);
    } else {
      apexSampleAnswer = 'Structure: Frame the technical constraint immediately -> Quantify squad size & $ impact -> Highlight the deliberate trade-off -> Conclude with measurable ROI (e.g. 99.99% uptime, 35% velocity gain).';
    }

    let nextFollowUpQuestion = '';
    const nextQMatch = text.match(/(?:next question|follow-up question|next up):?\s*["“]?([^”"\n]+)["”]?/i);
    if (nextQMatch && nextQMatch[1]) {
      nextFollowUpQuestion = nextQMatch[1].trim();
    } else {
      nextFollowUpQuestion = 'How did you handle the stakeholders who initially disagreed with your architectural proposal?';
    }

    return {
      situation,
      task,
      action,
      result,
      overall,
      competency: 'Leadership & High-Impact Delivery',
      strengths,
      growthAreas,
      apexSampleAnswer,
      nextFollowUpQuestion
    };
  } catch (err) {
    console.error('Error parsing STAR feedback', err);
    return undefined;
  }
}

export function extractDocumentFromMarkdown(text: string): GeneratedDocument | undefined {
  if (text.length < 100) return undefined;

  // Never extract career strategy assessments, roadmaps, or diagnostic audits as resumes
  if (/Apex Career Strategy Assessment|Personalized Early-Career Launchpad|Career Diagnostic & Strategic Roadmap|Strategic Assessment/i.test(text)) {
    return undefined;
  }

  const isResume = /(?:RESUME|CURRICULUM VITAE|## (?:PROFESSIONAL SUMMARY|CORE TECHNICAL SKILLS|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|NOTABLE .*PROJECTS))/i.test(text) && !/Career Plan|Diagnostic Audit|Specialized Modes/i.test(text);
  const isCoverLetter = /(?:Dear Hiring Manager|Dear Recruiting Team|I am writing to express my enthusiasm)/i.test(text);
  const isOutreach = /(?:Subject:|Hi\s+\w+,|reach out regarding|referral request)/i.test(text);
  const isNegotiation = /(?:Counter-Offer|Base Salary|Equity Vesting|Compensation Package|Negotiation Script)/i.test(text);

  if (isResume) {
    return {
      id: 'doc_' + Date.now(),
      title: 'ATS-Optimized Resume',
      type: 'resume',
      content: text,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } else if (isCoverLetter) {
    return {
      id: 'doc_' + Date.now(),
      title: 'Targeted Cover Letter',
      type: 'cover_letter',
      content: text,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } else if (isNegotiation) {
    return {
      id: 'doc_' + Date.now(),
      title: 'Compensation Negotiation Script',
      type: 'negotiation_script',
      content: text,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } else if (isOutreach) {
    return {
      id: 'doc_' + Date.now(),
      title: 'Executive Outreach Draft',
      type: 'outreach',
      content: text,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  return undefined;
}

export function calculateAtsKeywordMatch(resumeContent: string, targetSkills: string[]): {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
} {
  const contentLower = (resumeContent || '').toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  (targetSkills || []).forEach(skill => {
    if (contentLower.includes(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const total = targetSkills?.length || 1;
  const score = Math.round((matched.length / total) * 100);

  return {
    score: Math.min(Math.max(score, 10), 98),
    matchedKeywords: matched,
    missingKeywords: missing
  };
}

export function downloadAsFile(filename: string, content: string, mimeType: string = 'text/markdown') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
