export type AppMode = 
  | 'strategy' 
  | 'interview' 
  | 'studio' 
  | 'roadmap' 
  | 'negotiation'
  | 'audio_interview'
  | 'sandbox'
  | 'market_intel'
  | 'kanban'
  | 'on_the_job';

export type ExperienceLevel = 
  | 'Junior (0-2 yrs)' 
  | 'Mid-Level (3-5 yrs)' 
  | 'Senior (6-8 yrs)' 
  | 'Lead / Staff (9-12 yrs)' 
  | 'Principal / Exec (12+ yrs)';

export type InterviewerArchetype = 
  | 'staff_architect'    // The Skeptical Staff Architect
  | 'seed_founder'       // The Fast-Talking Seed Founder
  | 'product_vp';        // The Metric-Driven Product VP

export type CandidateTrack = 'student_fresher' | 'experienced';

export interface StudentFresherAnswers {
  degreeAndMajor?: string;           // Q1: degree, major, graduation date
  courseworkAndProjects?: string;     // Q2: coursework, academic projects, lab work
  technicalToolsAndLanguages?: string;// Q3: tools, languages, practical skills
  internshipsAndLeadership?: string;  // Q4: internships, volunteer, campus leadership
  softSkills?: string;                // Q5: communication, problem-solving, teamwork
  enjoyedSubjects?: string;           // Q6: enjoyed subjects/project topics
  firstJobPriorities?: string;        // Q7: learning, mentorship, brand, salary, WLB
  preferredWorkEnvironment?: string;  // Q8: startup, corporate, research lab
  roleType?: string;                  // Q9: full-time, internship, graduate program
  workLocationPreference?: string;    // Q10: remote, hybrid, on-site & relocation
  targetStartingSalary?: string;      // Q11: starting salary / minimum
  availabilityDate?: string;          // Q12: availability to start
  careerVsHigherEd?: string;          // Q13: workforce immediately vs higher ed
  dreamCompaniesAndTitles?: string;   // Q14: entry-level titles, dream companies
  supportAreasNeeded?: string;        // Q15: resume, portfolio, LinkedIn, interview prep
  recommendedCertificationsNeeded?: string; // Q16: courses, certs, hands-on projects
}

export interface ExperiencedAnswers {
  currentRoleAndTenure?: string;      // Q1: current role & tenure
  proficientSkillsAndTools?: string;  // Q2: technical & soft skills, tools
  skillsToLeaveBehind?: string;       // Q3: skills enjoyed vs leave behind
  formalEducationAndCerts?: string;   // Q4: degrees, certs, training
  nextRolePriorities?: string;        // Q5: earnings, WLB, progression, impact, security
  idealManagementStyle?: string;      // Q6: team dynamic & management style
  energizingPastProjects?: string;    // Q7: past tasks most energized & accomplished
  workLocationPreference?: string;    // Q8: remote, hybrid, on-site & relocation
  targetCompensation?: string;        // Q9: target salary / threshold
  weeklyUpskillingHours?: string;     // Q10: hours per week for upskilling/search
  careerMoveUrgency?: string;         // Q11: timeline / urgency
  careerGoalType?: string;            // Q12: grow in domain, pivot, or management
  targetCompaniesAndTitles?: string;  // Q13: specific titles, companies, industries
  emergingVsTraditional?: string;     // Q14: emerging fields vs traditional
  desiredGuidanceFormat?: string;     // Q15: step-by-step roadmap, broad list, resume/interview
  qualificationBridgeNeeds?: string;  // Q16: courses, certs, projects to bridge missing
}

export interface UserProfile {
  id: string;
  fullName: string;
  currentRole: string;
  experienceLevel: ExperienceLevel;
  candidateTrack?: CandidateTrack;
  studentAnswers?: StudentFresherAnswers;
  experiencedAnswers?: ExperiencedAnswers;
  industry: string;
  yearsOfExperience: number;
  keySkills: string[];
  targetRoles: string[];
  targetCompanies: string[];
  targetSalary: string;
  shortTermGoals: string;
  longTermGoals: string;
  resumeText: string;
  pastFeedback: string;
  preferredInterviewType: 'behavioral' | 'system_design' | 'technical_coding' | 'leadership';
}

export interface StarFeedback {
  situation: number;   // 1-10
  task: number;        // 1-10
  action: number;      // 1-10
  result: number;      // 1-10
  overall: number;     // 1-10
  competency: string;
  strengths: string[];
  growthAreas: string[];
  apexSampleAnswer: string;
  nextFollowUpQuestion: string;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  type: 'resume' | 'cover_letter' | 'outreach' | 'negotiation_script' | 'brag_sheet';
  content: string;
  updatedAt: string;
  targetRole?: string;
  targetCompany?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  mode: AppMode;
  starFeedback?: StarFeedback;
  extractedDoc?: GeneratedDocument;
}

export interface ChatSession {
  id: string;
  title: string;
  mode: AppMode;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarColor?: string;
  createdAt: string;
  profile: UserProfile;
  chatSessions: ChatSession[];
  documents: GeneratedDocument[];
}

export interface InterviewState {
  isActive: boolean;
  questionNumber: number;
  totalQuestions: number;
  currentQuestion: string;
  category: 'behavioral' | 'system_design' | 'technical_coding' | 'leadership';
  difficulty: 'Standard' | 'Rigorous' | 'FAANG / Tier-1 Bar Raiser';
  targetCompetency: string;
  history: {
    question: string;
    answer: string;
    feedback?: StarFeedback;
  }[];
}

// 1. Multimodal & Live Audio Interviewing Types
export interface SpeechTelemetryData {
  wordsPerMinute: number;
  fillerWordsCount: number;
  detectedFillers: string[];
  stutterCount: number;
  latencyPauseSeconds: number;
  confidenceScore: number; // 0-100%
  eyeContactConsistency: number; // 0-100%
  postureStatus: 'Optimal Alignment' | 'Slight Forward Tilt' | 'Looking Down / Disengaged';
}

// 2. Live Technical & Architectural Sandboxes Types
export interface SystemDesignNode {
  id: string;
  label: string;
  type: 'client' | 'lb' | 'gateway' | 'service' | 'cache' | 'database' | 'queue';
  status: 'healthy' | 'latency_spike' | 'partitioned' | 'overloaded';
  metrics: {
    rps: number;
    latencyMs: number;
    errorRate: number;
  };
}

export interface CodeTestCase {
  id: string;
  input: string;
  expected: string;
  actual?: string;
  passed?: boolean;
  isHidden?: boolean;
}

// 3. Market Intelligence Types
export interface IngestedJobPosting {
  id: string;
  url: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  requiredSkills: string[];
  preferredSkills: string[];
  rawText: string;
  extractedAt: string;
}

export interface SkillDeltaRadarItem {
  skill: string;
  requiredLevel: number; // 1-100
  candidateLevel: number; // 1-100
  gap: number;
  isStrength: boolean;
}

export interface SkillDecayItem {
  technology: string;
  trend: 'declining' | 'emerging' | 'stable' | 'surging';
  deltaPercent: number;
  advice: string;
}

// 4. Application Kanban Types
export type ApplicationStage = 'wishlist' | 'applied' | 'screening' | 'tech_rounds' | 'offer' | 'rejected';

export interface JobApplicationCard {
  id: string;
  company: string;
  role: string;
  salary: string;
  location: string;
  stage: ApplicationStage;
  appliedDate: string;
  hiringManager?: string;
  notes: string;
  debriefNotes?: string;
  nextStep?: string;
}

export interface PostInterviewDebrief {
  company: string;
  role: string;
  interviewType: string;
  questionsAsked: string[];
  knowledgeGapsIdentified: string[];
  customThankYouNote: string;
  debriefGeneratedAt: string;
}

// 5. Compensation & Tax Types
export interface EquityVestingSchedule {
  type: 'standard_25_each' | 'amazon_backloaded' | 'frontloaded' | 'custom';
  totalSharesOrGrant: number;
  initialStockPrice: number;
  projectedMultiple: number; // 1x, 2x, 5x
  year1: number;
  year2: number;
  year3: number;
  year4: number;
}

// 6. On-the-Job Longevity Types
export interface BragSheetEntry {
  id: string;
  weekEnding: string;
  category: 'Shipped Feature' | 'Architecture / PR' | 'Cost Savings' | 'Cross-Team Mentorship';
  headline: string;
  quantifiableImpact: string;
  stakeholders: string[];
}

export interface BurnoutRadarState {
  sentiment: 'Energized & Focused' | 'Moderate Strain' | 'Elevated Imposter Fatigue' | 'Severe Burnout Warning';
  score: number; // 1-100
  recommendedPacing: 'Aggressive Bar Raiser' | 'Balanced Growth' | 'Strategic Recovery';
  indicators: string[];
}

// 7. Core Architecture Types
export interface EpisodicMemoryRecord {
  id: string;
  timestamp: string;
  topic: string;
  sessionType: 'mock_interview' | 'resume_iteration' | 'negotiation';
  summary: string;
  similarityScore: number;
  tags: string[];
}

export type ThemeMode = 'bw-dark' | 'bw-light' | 'chatgpt';
export type PlatformView = 'desktop' | 'tablet' | 'mobile';

export interface AppSettings {
  apiKey: string;
  apiProvider: 'openai' | 'gemini' | 'anthropic' | 'mock';
  modelName: string;
  soundEnabled: boolean;
  streamSpeed: 'fast' | 'normal' | 'instant';
  themeMode: ThemeMode;
  platformView: PlatformView;
  interviewerArchetype: InterviewerArchetype;
  piiRedactionEnabled: boolean;
}
