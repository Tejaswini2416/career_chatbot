import { DEFAULT_USER_PROFILE, SAMPLE_PERSONAS } from './constants';
import { ChatSession, GeneratedDocument, UserAccount, UserProfile, ExperienceLevel, CandidateTrack, StudentFresherAnswers, ExperiencedAnswers } from './types';
import { generateCareerPlanFromProfile } from './ai-stream';

const USERS_STORAGE_KEY = 'apex_registered_users_v2';
const CURRENT_USER_KEY = 'apex_active_user_id_v2';

// Initial pre-configured seed users with rich profiles
export const INITIAL_DEMO_USERS: UserAccount[] = [
  {
    id: 'user_alex',
    name: 'Alex Morgan',
    email: 'alex@apex.ai',
    password: 'password123',
    avatarColor: 'from-emerald-500 to-teal-700',
    createdAt: new Date().toLocaleDateString(),
    profile: DEFAULT_USER_PROFILE,
    chatSessions: [
      {
        id: 'session_demo_1',
        title: 'Staff Engineer Promotion Strategy',
        mode: 'strategy',
        createdAt: 'Today',
        updatedAt: 'Today',
        messages: [
          {
            id: 'm1',
            role: 'user',
            content: 'How can I position myself for a Staff Software Engineer promotion over the next 90 days?',
            createdAt: '10:00 AM',
            mode: 'strategy',
          },
          {
            id: 'm2',
            role: 'assistant',
            content: `### 🎯 90-Day Staff Engineer Promotion Blueprint\n\nTo bridge the gap from **Senior** to **Staff**, your focus must shift from *individual execution* to *organizational multiplier effect*.\n\n#### 1. Technical Scope & Architecture (Days 1–30)\n- **Own a Cross-Team Problem**: Identify a bottleneck impacting 2+ engineering squads (e.g., distributed tracing or p99 latency).\n- **Write an RFC/ADR**: Frame options, trade-offs, and consensus mechanisms.\n\n#### 2. Amplifying Squad Velocity (Days 31–60)\n- **Mentorship Pipeline**: Actively coach 2 mid-level engineers toward Senior scope.\n- **Establish Standards**: Drive automated performance profiling in your CI/CD.\n\n#### 3. Executive Alignment & Visibility (Days 61–90)\n- **Quantify Business ROI**: Document cost savings ($180k/yr) and reliability gains (99.99% uptime).\n- **Sponsor Alignment**: Hold bi-weekly 1:1 check-ins with your Staff/Principal mentor and Director of Engineering.`,
            createdAt: '10:01 AM',
            mode: 'strategy',
          }
        ]
      }
    ],
    documents: [],
  },
  {
    id: 'user_maya',
    name: 'Maya Lin',
    email: 'maya@apex.ai',
    password: 'password123',
    avatarColor: 'from-purple-500 to-indigo-700',
    createdAt: new Date().toLocaleDateString(),
    profile: SAMPLE_PERSONAS[1]?.profile || {
      ...DEFAULT_USER_PROFILE,
      fullName: 'Maya Lin',
      currentRole: 'Senior Product Manager',
      targetRoles: ['Director of Product', 'VP of Product'],
    },
    chatSessions: [
      {
        id: 'session_demo_2',
        title: 'Product Vision & OKR Alignment',
        mode: 'strategy',
        createdAt: 'Yesterday',
        updatedAt: 'Yesterday',
        messages: [
          {
            id: 'm3',
            role: 'user',
            content: 'How do I articulate a 0-to-1 AI product vision to C-suite leadership?',
            createdAt: '2:15 PM',
            mode: 'strategy',
          },
          {
            id: 'm4',
            role: 'assistant',
            content: `### 🚀 Executive Product Vision Framework\n\n1. **Lead with the Customer Problem Space**: Define the friction before introducing AI.\n2. **Defensible Value Wedge**: Why our proprietary data or distribution makes us win.\n3. **3-Horizon Financial Model**: Horizon 1 (Immediate ARR impact), Horizon 2 (Product expansion), Horizon 3 (Platform flywheel).`,
            createdAt: '2:16 PM',
            mode: 'strategy',
          }
        ]
      }
    ],
    documents: [],
  },
  {
    id: 'user_david',
    name: 'David Chen',
    email: 'david@apex.ai',
    password: 'password123',
    avatarColor: 'from-amber-500 to-orange-700',
    createdAt: new Date().toLocaleDateString(),
    profile: SAMPLE_PERSONAS[2]?.profile || {
      ...DEFAULT_USER_PROFILE,
      fullName: 'David Chen',
      currentRole: 'Data Analyst / ML Engineer',
      targetRoles: ['Applied AI Engineer', 'Senior ML Specialist'],
    },
    chatSessions: [],
    documents: [],
  }
];

export function getAllUsers(): UserAccount[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USERS));
    return INITIAL_DEMO_USERS;
  } catch (e) {
    console.error('Failed to load users from localStorage', e);
    return INITIAL_DEMO_USERS;
  }
}

export function saveAllUsers(users: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function getCurrentUser(): UserAccount {
  const users = getAllUsers();
  if (typeof window === 'undefined') return users[0];

  try {
    const currentId = localStorage.getItem(CURRENT_USER_KEY);
    if (currentId) {
      const found = users.find(u => u.id === currentId);
      if (found) {
        // Self-heal/normalize student profiles
        if (/student|fresher|intern/i.test(found.profile.currentRole || '') && (found.profile.candidateTrack !== 'student_fresher' || found.profile.yearsOfExperience > 1)) {
          found.profile.candidateTrack = 'student_fresher';
          found.profile.yearsOfExperience = 0;
          found.profile.experienceLevel = 'Junior (0-2 yrs)';
          if (found.chatSessions && found.chatSessions.length > 0 && found.chatSessions[0].messages?.length > 0) {
            const firstMsg = found.chatSessions[0].messages[0];
            if (firstMsg.content.includes('3 YOE') || firstMsg.content.includes('3 years in SaaS') || firstMsg.content.includes('2+ pods')) {
              firstMsg.content = generateCareerPlanFromProfile(found.profile);
            }
          }
          updateActiveUserData(found);
        }
        return found;
      }
    }
  } catch (e) {
    console.error('Failed to get current user', e);
  }

  const defaultUser = users[0] || INITIAL_DEMO_USERS[0];
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, defaultUser.id);
  }
  return defaultUser;
}

export function setCurrentUser(userId: string): UserAccount | null {
  const users = getAllUsers();
  const target = users.find(u => u.id === userId);
  if (target && typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, target.id);
    return target;
  }
  return null;
}

export function loginUser(email: string, password?: string): { success: boolean; user?: UserAccount; error?: string } {
  const users = getAllUsers();
  const cleanEmail = email.trim().toLowerCase();
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (password && found.password && found.password !== password) {
    return { success: false, error: 'Incorrect password. (Try password123 or register a new user)' };
  }

  setCurrentUser(found.id);
  return { success: true, user: found };
}

export function registerUser(data: {
  name: string;
  email: string;
  password?: string;
  currentRole: string;
  targetRole: string;
  yearsOfExperience?: number;
  experienceLevel: ExperienceLevel;
  candidateTrack?: CandidateTrack;
  studentAnswers?: StudentFresherAnswers;
  experiencedAnswers?: ExperiencedAnswers;
  keySkills?: string[];
  industry?: string;
  targetSalary?: string;
}): { success: boolean; user?: UserAccount; error?: string } {
  const users = getAllUsers();
  const cleanEmail = data.email.trim().toLowerCase();

  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const colorPalettes = [
    'from-emerald-500 to-teal-700',
    'from-indigo-500 to-purple-700',
    'from-blue-500 to-cyan-700',
    'from-rose-500 to-pink-700',
    'from-amber-500 to-orange-700',
    'from-violet-500 to-fuchsia-700'
  ];
  const avatarColor = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

  const isStudent = data.candidateTrack === 'student_fresher' || /student|fresher|intern|undergrad/i.test(data.currentRole);

  const skills = data.keySkills && data.keySkills.length > 0 
    ? data.keySkills 
    : isStudent 
      ? ['Python', 'SQL', 'Data Analysis', 'Machine Learning Foundations', 'Git']
      : ['System Architecture', 'TypeScript / Node.js', 'Distributed Systems', 'Cloud Platforms'];

  const newProfile: UserProfile = {
    ...DEFAULT_USER_PROFILE,
    id: 'profile_' + Date.now(),
    fullName: data.name.trim(),
    currentRole: data.currentRole.trim() || (isStudent ? 'Student / Fresher' : 'Software Engineer'),
    targetRoles: [data.targetRole.trim() || (isStudent ? 'Junior Data Scientist' : 'Senior Software Engineer')],
    yearsOfExperience: isStudent ? 0 : (data.yearsOfExperience || 3),
    experienceLevel: isStudent ? 'Junior (0-2 yrs)' : (data.experienceLevel || 'Mid-Level (3-5 yrs)'),
    candidateTrack: isStudent ? 'student_fresher' : 'experienced',
    studentAnswers: data.studentAnswers,
    experiencedAnswers: data.experiencedAnswers,
    industry: data.industry?.trim() || (isStudent ? 'Technology & AI' : 'Technology & Cloud Platforms'),
    keySkills: skills,
    targetSalary: data.targetSalary?.trim() || (isStudent ? '$95,000 - $125,000 Base' : '$180,000 - $240,000 Base ($300k+ TC)'),
    resumeText: `# ${data.name.toUpperCase()}\n**${data.currentRole}** | Target: **${data.targetRole}**\nEmail: ${cleanEmail}\n\n## SUMMARY\nResults-driven ${data.currentRole} targeting ${data.targetRole}.`,
  };

  // Automatically generate personalized Career Plan for the new user
  const initialCareerPlanContent = generateCareerPlanFromProfile(newProfile);

  const initialSession: ChatSession = {
    id: 'session_' + Date.now(),
    title: `Career Plan: ${newProfile.targetRoles[0]}`,
    mode: 'strategy',
    createdAt: 'Just now',
    updatedAt: 'Just now',
    messages: [
      {
        id: 'msg_welcome_' + Date.now(),
        role: 'assistant',
        content: initialCareerPlanContent,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'strategy',
      }
    ]
  };

  const newUser: UserAccount = {
    id: 'user_' + Date.now(),
    name: data.name.trim(),
    email: cleanEmail,
    password: data.password || 'password123',
    avatarColor,
    createdAt: new Date().toLocaleDateString(),
    profile: newProfile,
    chatSessions: [initialSession],
    documents: [],
  };

  const updatedUsers = [newUser, ...users];
  saveAllUsers(updatedUsers);
  setCurrentUser(newUser.id);

  return { success: true, user: newUser };
}

export function updateActiveUserData(updatedUser: UserAccount): void {
  const users = getAllUsers();
  const nextUsers = users.map(u => (u.id === updatedUser.id ? updatedUser : u));
  saveAllUsers(nextUsers);
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, updatedUser.id);
  }
}
