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

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user_default',
  fullName: 'Alex Morgan',
  currentRole: 'Senior Full Stack Engineer',
  experienceLevel: 'Senior (6-8 yrs)',
  industry: 'FinTech / SaaS Cloud Platforms',
  yearsOfExperience: 7,
  keySkills: ['TypeScript', 'React / Next.js', 'Node.js', 'Distributed Systems', 'PostgreSQL', 'AWS / Kubernetes', 'GraphQL', 'System Architecture'],
  targetRoles: ['Staff Software Engineer', 'Engineering Lead / Architect'],
  targetCompanies: ['Stripe', 'Datadog', 'Airbnb', 'Scale AI', 'High-Growth Series B+'],
  targetSalary: '$220,000 - $260,000 Base + Equity ($350k+ TC)',
  shortTermGoals: 'Lead a cross-team architecture initiative, pass Staff-level System Design interviews, and polish executive communication.',
  longTermGoals: 'Reach Principal Engineer or VP of Engineering within 4 years, leading high-impact infrastructure platforms.',
  resumeText: `ALEX MORGAN | Senior Full Stack Engineer
alex.morgan@example.com | github.com/alexmorgan | San Francisco, CA

SUMMARY
Strategic Senior Engineer with 7+ years architecting cloud-scale distributed systems and high-throughput real-time APIs. Led cross-functional squad of 8 engineers delivering 99.99% uptime services processing $45M+ in monthly transactions.

EXPERIENCE
SENIOR SOFTWARE ENGINEER | ApexFin Technologies (2022 - Present)
- Architected microservices migration reducing p99 latency from 450ms to 85ms across 12M daily requests.
- Spearheaded React/Next.js design system overhaul across 4 product lines, accelerating engineering velocity by 35%.
- Mentored 5 mid-level and junior engineers through promotion pipelines.

SOFTWARE ENGINEER II | CloudFlow Systems (2019 - 2022)
- Built streaming data pipelines using Kafka and Go, handling 50k events/sec with zero data loss.
- Reduced cloud infrastructure costs by 28% ($180k/yr) via intelligent auto-scaling and Redis caching.

EDUCATION & SKILLS
B.S. in Computer Science - UC Berkeley
Core: TypeScript, Next.js, Node.js, Go, AWS, Docker, Kubernetes, Distributed Systems, SQL.`,
  pastFeedback: 'Strong technical delivery and fast execution. Feedback highlighted the need to amplify cross-team influence and communicate system trade-offs with higher executive presence.',
  preferredInterviewType: 'behavioral'
};

export const SAMPLE_PERSONAS: { name: string; tag: string; description: string; profile: UserProfile }[] = [
  {
    name: 'Alex Morgan',
    tag: 'Engineering Leadership',
    description: 'Senior Full Stack -> Staff Engineer / Tech Lead',
    profile: DEFAULT_USER_PROFILE
  },
  {
    name: 'Maya Lin',
    tag: 'Product Strategy',
    description: 'Senior Product Manager -> Director of Product',
    profile: {
      id: 'user_maya',
      fullName: 'Maya Lin',
      currentRole: 'Senior Product Manager',
      experienceLevel: 'Senior (6-8 yrs)',
      industry: 'Enterprise B2B SaaS & AI Tools',
      yearsOfExperience: 6,
      keySkills: ['Product Strategy', 'PLG Growth', 'Roadmapping', 'Data Analytics (SQL/Mixpanel)', 'AI Integration', 'Cross-functional Leadership', 'User Research'],
      targetRoles: ['Principal Product Manager', 'Director of Product'],
      targetCompanies: ['Figma', 'Notion', 'OpenAI', 'Linear', 'Atlassian'],
      targetSalary: '$210,000 - $250,000 Base ($340k+ TC)',
      shortTermGoals: 'Craft 0-to-1 AI product strategy, demonstrate $10M+ ARR impact, and prepare for executive product vision interviews.',
      longTermGoals: 'VP of Product at a high-growth tier-1 tech company.',
      resumeText: `MAYA LIN | Senior Product Manager
maya.lin@example.com | linkedin.com/in/mayalin | New York, NY

EXPERIENCE
Senior Product Manager - Enterprise SaaS (2022-Present)
- Led end-to-end launch of flagship collaborative workflow tool driving $14.2M net-new ARR in first 12 months.
- Increased user retention by 24% by redesigning onboarding flow and self-serve PLG levers.
- Managed 3 engineering pods and 2 product designers with quarterly OKR delivery rate of 96%.`,
      pastFeedback: 'Outstanding customer empathy and metric tracking. Next step is presenting broader multi-year vision to C-suite.',
      preferredInterviewType: 'leadership'
    }
  },
  {
    name: 'David Chen',
    tag: 'AI & Data Pivot',
    description: 'Data Analyst -> AI / Machine Learning Engineer',
    profile: {
      id: 'user_david',
      fullName: 'David Chen',
      currentRole: 'Data Analyst / BI Specialist',
      experienceLevel: 'Mid-Level (3-5 yrs)',
      industry: 'E-commerce & AdTech',
      yearsOfExperience: 4,
      keySkills: ['Python', 'SQL', 'PyTorch / Scikit-Learn', 'LLM Fine-tuning', 'FastAPI', 'Pandas', 'Vector DBs (Pinecone)', 'Docker'],
      targetRoles: ['Applied AI Engineer', 'Machine Learning Engineer'],
      targetCompanies: ['Anthropic', 'Hugging Face', 'Cohere', 'Shopify', 'Midjourney'],
      targetSalary: '$170,000 - $200,000 Base',
      shortTermGoals: 'Complete RAG and fine-tuning production projects, replace legacy BI reports with agentic pipelines, and ace ML coding rounds.',
      longTermGoals: 'Lead Applied AI engineering team tackling multimodal models.',
      resumeText: `DAVID CHEN | Applied AI & Data Engineer
david.chen@example.com | github.com/davidchen | Seattle, WA

EXPERIENCE
Data Analyst & AI Engineer - E-Commerce Inc. (2021-Present)
- Built internal LLM customer support assistant reducing ticket resolution time by 42%.
- Developed automated forecasting models in Python predicting customer churn with 89% accuracy.
- Processed 100M+ event logs weekly using Snowflake and dbt.`,
      pastFeedback: 'Great analytical rigor. Work on showing full-stack production deployment capability for ML models.',
      preferredInterviewType: 'technical_coding'
    }
  }
];

export const STARTER_PROMPTS: Record<string, { label: string; prompt: string; icon: string }[]> = {
  strategy: [
    {
      label: 'Staff Promotion Strategy',
      prompt: 'Based on my profile and past feedback, create a concrete 90-day gameplan to establish Staff-level scope and secure my promotion.',
      icon: 'Target'
    },
    {
      label: 'Career Gap & Risk Audit',
      prompt: 'Audit my current skill set and experience against Staff Engineer roles at Tier-1 tech companies. What are my top 3 blind spots?',
      icon: 'ShieldAlert'
    },
    {
      label: 'Executive Presence Roadmap',
      prompt: 'My feedback mentions elevating cross-team influence. What specific frameworks or communication patterns should I implement this week?',
      icon: 'Sparkles'
    },
    {
      label: '2026 Tech Trend Positioning',
      prompt: 'How should I position my background to capitalize on AI integration and modern infrastructure demands for high-paying roles?',
      icon: 'TrendingUp'
    }
  ],
  interview: [
    {
      label: 'Start Behavioral Mock (STAR)',
      prompt: 'Start an intensive Mock Interview session for a Staff Software Engineer role. Ask me a tough question about resolving cross-team technical conflict.',
      icon: 'MessageSquare'
    },
    {
      label: 'System Design Bar-Raiser',
      prompt: 'Conduct a Mock Interview on designing a global high-throughput financial ledger with strict idempotency and sub-100ms latency.',
      icon: 'Cpu'
    },
    {
      label: 'Leadership / Disagreement',
      prompt: 'Ask me a difficult leadership question where I had to push back on a VP or product deadline due to critical technical debt.',
      icon: 'Users'
    },
    {
      label: 'Failure & Resilience Question',
      prompt: 'Interview me on: "Tell me about a major production outage or project failure you caused, and how you handled the aftermath."',
      icon: 'AlertTriangle'
    }
  ],
  studio: [
    {
      label: 'Generate Staff ATS Resume',
      prompt: 'Generate an ATS-optimized, high-impact resume draft tailored to Staff Software Engineer roles at companies like Stripe and Datadog, emphasizing quantifiable scale.',
      icon: 'FileText'
    },
    {
      label: 'Targeted High-Conversion Cover Letter',
      prompt: 'Write a persuasive, non-generic cover letter for a Principal/Staff Engineer opening at Stripe, highlighting my distributed systems experience.',
      icon: 'Mail'
    },
    {
      label: 'Executive Cold Outreach Message',
      prompt: 'Draft 3 high-response LinkedIn cold outreach messages to Engineering Directors at my target companies for referral requests.',
      icon: 'Send'
    },
    {
      label: 'Executive Brag Sheet & Review',
      prompt: 'Generate a structured Performance Review Brag Sheet summarizing my technical impact, squad mentorship, and business metrics.',
      icon: 'Award'
    }
  ],
  roadmap: [
    {
      label: '30-60-90 Day Skill Roadmap',
      prompt: 'Generate an actionable 30-60-90 day milestone roadmap with recommended open-source projects, system design concepts, and books to reach Staff Engineer.',
      icon: 'Map'
    },
    {
      label: 'Benchmark vs Target Roles',
      prompt: 'Perform a comprehensive benchmark comparing my current 7 years fullstack experience with current Staff Engineer job requirements at top tier companies.',
      icon: 'BarChart3'
    }
  ],
  negotiation: [
    {
      label: 'Counter-Offer Negotiation Script',
      prompt: 'Help me negotiate an offer of $220k Base + $150k Equity to reach $245k Base + $200k Equity. Give me the exact email and phone script.',
      icon: 'DollarSign'
    },
    {
      label: 'Multiple Offers Leverage Strategy',
      prompt: 'I have two competing offers: Company A ($230k TC) and Company B ($260k TC). How do I leverage Company B without burning bridges with Company A?',
      icon: 'Briefcase'
    }
  ],
  audio_interview: [
    {
      label: 'Verbal System Design Drill',
      prompt: 'Walk me through designing an idempotent payment ledger with sub-50ms latency. Measure my speech cadence and filler words.',
      icon: 'Cpu'
    },
    {
      label: 'Executive Leadership Verbal Defense',
      prompt: 'Ask me a high-pressure question about defending a 3-week product delay to C-suite executives due to security vulnerabilities.',
      icon: 'Users'
    }
  ],
  sandbox: [
    {
      label: 'DB Partition Split-Brain Simulation',
      prompt: 'Simulate a cross-AZ partition failure on my primary PostgreSQL database. Walk me through handling Raft quorum loss and connection starvation.',
      icon: 'Cpu'
    },
    {
      label: 'Token Bucket Rate Limiter Audit',
      prompt: 'Audit my in-browser rate limiter implementation for concurrency race conditions and thread safety under 50k RPS.',
      icon: 'Code'
    }
  ],
  market_intel: [
    {
      label: 'Ingest Staff Engineer Posting',
      prompt: 'Analyze current job market requirements for Staff Software Engineers at Stripe, Datadog, and Scale AI. Calculate my skill delta.',
      icon: 'Target'
    },
    {
      label: 'Tech Volatility & Decay Audit',
      prompt: 'What legacy frameworks on my resume are experiencing skill decay, and what surging 2026 AI tools should I prioritize?',
      icon: 'TrendingUp'
    }
  ],
  kanban: [
    {
      label: 'Automated Post-Interview Debrief',
      prompt: 'Help me debrief my System Design interview with Stripe today. Draft a personalized thank-you note highlighting distributed caching trade-offs.',
      icon: 'Mail'
    },
    {
      label: 'Pipeline Conversion Optimization',
      prompt: 'Review my job search pipeline across 4 active applications. How do I accelerate recruiter response rates from Screening to Offer?',
      icon: 'Briefcase'
    }
  ],
  on_the_job: [
    {
      label: '30-Day Stakeholder Map',
      prompt: 'Create a 30-day stakeholder listening tour plan for my new Staff Engineer role to build cross-functional leverage and trust.',
      icon: 'Target'
    },
    {
      label: 'Weekly Brag Sheet Generation',
      prompt: 'Help me format this week\'s technical wins into quantifiable business impact metrics for my upcoming quarterly performance review.',
      icon: 'Award'
    }
  ]
};
