import { DEFAULT_USER_PROFILE } from './constants';
import { ChatSession, GeneratedDocument, UserAccount, UserProfile, ExperienceLevel, CandidateTrack, StudentFresherAnswers, ExperiencedAnswers } from './types';
import { generateCareerPlanFromProfile } from './ai-stream';

const USERS_STORAGE_KEY = 'apex_registered_users_v2';
const CURRENT_USER_KEY = 'apex_active_user_id_v2';

// No demo users — all users register fresh
export function getAllUsers(): UserAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load users from localStorage', e);
  }
  return [];
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
  if (typeof window === 'undefined' || users.length === 0) {
    // Return a blank guest user when no users exist
    return createGuestUser();
  }

  try {
    const currentId = localStorage.getItem(CURRENT_USER_KEY);
    if (currentId) {
      const found = users.find(u => u.id === currentId);
      if (found) return found;
    }
  } catch (e) {
    console.error('Failed to get current user', e);
  }

  // Default to first registered user
  const defaultUser = users[0];
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, defaultUser.id);
  }
  return defaultUser;
}

function createGuestUser(): UserAccount {
  const guest: UserAccount = {
    id: 'user_guest_' + Date.now(),
    name: 'Guest',
    email: '',
    password: '',
    avatarColor: 'from-blue-500 to-indigo-700',
    createdAt: new Date().toLocaleDateString(),
    profile: { ...DEFAULT_USER_PROFILE, fullName: 'Guest' },
    chatSessions: [],
    documents: [],
  };

  // Persist the guest so the app has a valid user
  if (typeof window !== 'undefined') {
    saveAllUsers([guest]);
    localStorage.setItem(CURRENT_USER_KEY, guest.id);
  }

  return guest;
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
    return { success: false, error: 'No account found with this email. Please register first.' };
  }

  if (password && found.password && found.password !== password) {
    return { success: false, error: 'Incorrect password.' };
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
    password: data.password || '',
    avatarColor,
    createdAt: new Date().toLocaleDateString(),
    profile: newProfile,
    chatSessions: [initialSession],
    documents: [],
  };

  // Remove guest users when a real user registers
  const realUsers = users.filter(u => !u.id.startsWith('user_guest_'));
  const updatedUsers = [newUser, ...realUsers];
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
