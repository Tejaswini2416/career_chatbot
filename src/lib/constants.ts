import { UserProfile } from './types';

export const APEX_SYSTEM_PROMPT = `You are Apex, an expert AI Career Coach and Strategic Advisor dedicated to helping the user navigate, accelerate, and optimize their professional career.

CORE OBJECTIVES:
1. Provide highly personalized, actionable, and hyper-contextual career advice based on the user's specific skill set, past experience, and long-term goals.
2. Act as a proactive partner for skill growth, job search execution, interview preparation, and compensation negotiation.

BEHAVIORAL INSTRUCTIONS & PERSONALIZATION:
- Dynamic Context Retention: Always reference and adapt to the user's profile context (skills, domain focus, target roles, past performance feedback).
- Tone & Style: Direct, strategic, supportive, and practical. Avoid generic corporate filler, fluff, or hand-waving. Use clear bullet points, quantitative frameworks, and executive-level clarity.
- Proactive Guidance: Always offer concrete next steps and relevant follow-up actions (e.g., offer mock interview prep after resume review, offer counter-offer negotiation scripts when discussing compensation).

CORE CAPABILITIES & MODES:
1. Profile & Skill Gap Analysis: Benchmark profile against target roles; highlight critical gaps, learning paths, and high-leverage leverage points.
2. Tailored Document Generation: Produce ATS-optimized resumes, punchy cover letters, executive LinkedIn outreach messages, and brag sheets.
3. Interactive Mock Interviewer: Provide "Mock Interview Mode" with immediate STAR/technical feedback, scoring (1-10 on Situation, Task, Action, Result), pinpointing missing metrics and generating ideal Apex answer models.
4. Strategic Execution & Negotiation: Step-by-step guidance on compensation, promotion pitches, and personal branding.

When evaluating an interview answer in Mock Interview Mode, ALWAYS include a structured STAR evaluation with:
- Situation, Task, Action, Result breakdown & score (1-10)
- Top Strengths & Critical Growth Gaps
- An improved Apex Sample Answer demonstrating how to articulate it at an executive/tier-1 level
- The next interview follow-up question.`;

// Empty default profile — filled in by user during registration or 16-Q diagnostic
export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user_default',
  fullName: '',
  currentRole: '',
  experienceLevel: 'Mid-Level (3-5 yrs)',
  industry: '',
  yearsOfExperience: 0,
  keySkills: [],
  targetRoles: [],
  targetCompanies: [],
  targetSalary: '',
  shortTermGoals: '',
  longTermGoals: '',
  resumeText: '',
  pastFeedback: '',
  preferredInterviewType: 'behavioral'
};

// No pre-built demo personas — users create their own profiles
export const SAMPLE_PERSONAS: { name: string; tag: string; description: string; profile: UserProfile }[] = [];

export const STARTER_PROMPTS: Record<string, { label: string; prompt: string; icon: string }[]> = {
  strategy: [
    {
      label: 'Career Growth Strategy',
      prompt: 'Based on my profile and goals, create a concrete 90-day gameplan to advance to my target role.',
      icon: 'Target'
    },
    {
      label: 'Skill Gap Analysis',
      prompt: 'Audit my current skill set and experience against my target roles. What are my top 3 gaps and how should I close them?',
      icon: 'ShieldAlert'
    },
    {
      label: 'Executive Presence Tips',
      prompt: 'What specific frameworks or communication patterns should I adopt to increase my visibility and influence at work?',
      icon: 'Sparkles'
    },
    {
      label: 'Industry Trend Positioning',
      prompt: 'How should I position my background to capitalize on current industry trends and emerging high-demand skills?',
      icon: 'TrendingUp'
    }
  ],
  interview: [
    {
      label: 'Start Behavioral Mock (STAR)',
      prompt: 'Start an intensive Mock Interview session for my target role. Ask me a tough behavioral question.',
      icon: 'MessageSquare'
    },
    {
      label: 'System Design Challenge',
      prompt: 'Conduct a Mock Interview on designing a scalable distributed system relevant to my target role.',
      icon: 'Cpu'
    },
    {
      label: 'Leadership Scenario',
      prompt: 'Ask me a difficult leadership question about handling cross-team conflict or stakeholder disagreement.',
      icon: 'Users'
    },
    {
      label: 'Failure & Resilience',
      prompt: 'Interview me on: "Tell me about a major failure or setback you experienced, and how you handled it."',
      icon: 'AlertTriangle'
    }
  ],
  studio: [
    {
      label: 'Generate ATS Resume',
      prompt: 'Generate an ATS-optimized, high-impact resume draft tailored to my target role, emphasizing quantifiable achievements.',
      icon: 'FileText'
    },
    {
      label: 'Cover Letter',
      prompt: 'Write a persuasive, non-generic cover letter for my target role highlighting my most relevant experience.',
      icon: 'Mail'
    },
    {
      label: 'LinkedIn Outreach',
      prompt: 'Draft 3 high-response LinkedIn cold outreach messages to hiring managers at companies I\'m targeting.',
      icon: 'Send'
    },
    {
      label: 'Brag Sheet',
      prompt: 'Generate a structured Performance Review Brag Sheet summarizing my key achievements and business impact.',
      icon: 'Award'
    }
  ],
  roadmap: [
    {
      label: '30-60-90 Day Roadmap',
      prompt: 'Generate an actionable 30-60-90 day milestone roadmap with resources and projects to reach my target role.',
      icon: 'Map'
    },
    {
      label: 'Benchmark vs Target Roles',
      prompt: 'Perform a comprehensive benchmark comparing my current experience with the requirements for my target roles.',
      icon: 'BarChart3'
    }
  ],
  negotiation: [
    {
      label: 'Counter-Offer Script',
      prompt: 'Help me negotiate my current offer to reach a higher base salary and equity package. Give me the exact scripts.',
      icon: 'DollarSign'
    },
    {
      label: 'Multiple Offers Strategy',
      prompt: 'I have multiple competing offers. How do I leverage them ethically to maximize my total compensation?',
      icon: 'Briefcase'
    }
  ],
  audio_interview: [
    {
      label: 'Verbal Technical Drill',
      prompt: 'Walk me through a technical design problem relevant to my role. Measure my speech cadence and filler words.',
      icon: 'Cpu'
    },
    {
      label: 'Executive Communication',
      prompt: 'Ask me a high-pressure question about defending a decision to senior leadership.',
      icon: 'Users'
    }
  ],
  sandbox: [
    {
      label: 'Architecture Challenge',
      prompt: 'Present me with a system architecture challenge relevant to my target role and walk me through solving it.',
      icon: 'Cpu'
    },
    {
      label: 'Code Review Drill',
      prompt: 'Give me a code implementation to review for correctness, performance, and best practices.',
      icon: 'Code'
    }
  ],
  market_intel: [
    {
      label: 'Job Market Analysis',
      prompt: 'Analyze current job market requirements for my target role at top companies. Calculate my skill delta.',
      icon: 'Target'
    },
    {
      label: 'Skill Demand Trends',
      prompt: 'What skills are currently in highest demand for my target role and which of my skills might be declining in value?',
      icon: 'TrendingUp'
    }
  ],
  kanban: [
    {
      label: 'Post-Interview Debrief',
      prompt: 'Help me debrief my recent interview. Draft a personalized thank-you note highlighting key discussion points.',
      icon: 'Mail'
    },
    {
      label: 'Pipeline Optimization',
      prompt: 'Review my job search pipeline and suggest how to accelerate my progress from application to offer.',
      icon: 'Briefcase'
    }
  ],
  on_the_job: [
    {
      label: '30-Day Onboarding Plan',
      prompt: 'Create a 30-day stakeholder listening tour plan for my new role to build cross-functional leverage and trust.',
      icon: 'Target'
    },
    {
      label: 'Weekly Brag Sheet',
      prompt: 'Help me format this week\'s wins into quantifiable business impact metrics for my performance review.',
      icon: 'Award'
    }
  ]
};
