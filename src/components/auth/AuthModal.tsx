import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  LogIn, 
  Users, 
  Check, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Mail,
  Lock,
  Target,
  Zap,
  GraduationCap,
  DollarSign,
  Building
} from 'lucide-react';
import { getAllUsers, loginUser, registerUser, setCurrentUser } from '@/lib/auth';
import { UserAccount, ExperienceLevel, CandidateTrack } from '@/lib/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUserChanged: (newUser: UserAccount) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
}: AuthModalProps) {
  const [tab, setTab] = useState<'switch' | 'login' | 'register'>('switch');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration Questionnaire State
  const [regTrack, setRegTrack] = useState<CandidateTrack>('student_fresher');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCurrentRole, setRegCurrentRole] = useState('Student / Recent Graduate');
  const [regTargetRole, setRegTargetRole] = useState('Data Scientist');
  const [regYears, setRegYears] = useState<number>(0);
  const [regExp, setRegExp] = useState<ExperienceLevel>('Junior (0-2 yrs)');
  const [regSkills, setRegSkills] = useState('Python, SQL, Machine Learning, Pandas, Scikit-Learn, Git');
  const [regIndustry, setRegIndustry] = useState('Technology & AI');
  const [regTargetSalary, setRegTargetSalary] = useState('$95,000 - $125,000 Base ($140k+ TC)');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const allUsers = getAllUsers();

  const handleSelectUser = (user: UserAccount) => {
    setCurrentUser(user.id);
    onUserChanged(user);
    setSuccessMsg(`Switched to ${user.name}`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 400);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    const res = loginUser(loginEmail, loginPassword);
    if (res.success && res.user) {
      onUserChanged(res.user);
      setSuccessMsg(`Welcome back, ${res.user.name}!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 500);
    } else {
      setErrorMsg(res.error || 'Failed to log in.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg('Please enter your full name and email.');
      setRegisterStep(1);
      return;
    }

    if (!regCurrentRole.trim() || !regTargetRole.trim()) {
      setErrorMsg('Please specify both your current role and your chosen target role.');
      setRegisterStep(2);
      return;
    }

    const skillsArray = regSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const res = registerUser({
      name: regName,
      email: regEmail,
      password: regPassword || 'password123',
      currentRole: regCurrentRole,
      targetRole: regTargetRole,
      candidateTrack: regTrack,
      yearsOfExperience: Number(regYears) || 0,
      experienceLevel: regExp,
      keySkills: skillsArray.length > 0 ? skillsArray : ['Python', 'SQL', 'Data Science'],
      industry: regIndustry,
      targetSalary: regTargetSalary,
    });

    if (res.success && res.user) {
      onUserChanged(res.user);
      setSuccessMsg(`🎉 Account created! Your personalized Career Plan is ready.`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
      <div 
        className="w-full max-w-lg bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[var(--text-main)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Apex Career Accounts</h2>
              <p className="text-[11px] text-[var(--text-muted)]">Personalized Career Questionnaires & Plans</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-medium">
          <button
            onClick={() => { setTab('switch'); setErrorMsg(null); }}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              tab === 'switch' 
                ? 'border-[var(--text-main)] text-[var(--text-main)] bg-[var(--bg-surface-hover)] font-semibold' 
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch User ({allUsers.length})</span>
          </button>
          <button
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              tab === 'login' 
                ? 'border-[var(--text-main)] text-[var(--text-main)] bg-[var(--bg-surface-hover)] font-semibold' 
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(null); }}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              tab === 'register' 
                ? 'border-[var(--text-main)] text-[var(--text-main)] bg-[var(--bg-surface-hover)] font-semibold' 
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register & Plan</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: Fast Switch Existing Users */}
          {tab === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-muted)]">
                Select an active user to load their individual career profile, past chats, and customized roadmaps:
              </p>

              <div className="space-y-2">
                {allUsers.map((user) => {
                  const isActive = user.id === currentUser.id;
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive 
                          ? 'bg-[var(--bg-surface-hover)] border-[var(--border-color)] ring-1 ring-[var(--bg-accent)]' 
                          : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:bg-[var(--bg-surface-hover)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center font-bold text-sm shadow-md">
                          {user.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[var(--text-main)]">{user.name}</span>
                            {isActive && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-color)] font-mono">
                                Active Now
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[var(--text-muted)]">
                            {user.profile?.currentRole || 'Professional'} → <strong className="text-[var(--text-main)]">{user.profile?.targetRoles?.[0] || 'Target Role'}</strong>
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            {user.email} • {user.chatSessions?.length || 0} chats saved
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isActive ? (
                          <div className="w-6 h-6 rounded-full bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center font-bold">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface-hover)] text-xs text-[var(--text-main)] hover:border-[var(--border-color)] border border-transparent transition-colors"
                          >
                            Switch
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-xs text-[var(--text-main)] underline font-medium inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register a new career persona & build plan</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Log In Existing Account */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-main)] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@apex.ai"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-main)] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Demo password: password123"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
                />
                <p className="text-[11px] text-[var(--text-muted)]">Demo accounts (Alex, Maya, David) all use: password123</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Log In & Load Career Chats</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: Register & Interactive Career Questionnaire */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Questionnaire Step Indicator */}
              <div className="flex items-center justify-between px-1 pb-1 border-b border-[var(--border-color)] text-xs">
                <span className="font-semibold text-[var(--text-main)]">
                  {registerStep === 1 ? 'Step 1 of 2: Account Credentials' : 'Step 2 of 2: Career Questionnaire'}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${registerStep === 1 ? 'bg-[var(--bg-accent)]' : 'bg-zinc-600'}`} />
                  <span className={`w-2 h-2 rounded-full ${registerStep === 2 ? 'bg-[var(--bg-accent)]' : 'bg-zinc-600'}`} />
                </div>
              </div>

              {/* STEP 1: Basic Identity */}
              {registerStep === 1 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--text-main)]">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Vance"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--text-main)]">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jordan@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--text-main)]">Password</label>
                    <input
                      type="password"
                      placeholder="Set account password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!regName.trim() || !regEmail.trim()) {
                        setErrorMsg('Please enter your full name and email first.');
                        return;
                      }
                      setErrorMsg(null);
                      setRegisterStep(2);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 mt-2"
                  >
                    <span>Proceed to Career Questions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* STEP 2: Career Experience & Role Questionnaire */}
              {registerStep === 2 && (
                <div className="space-y-3">
                  {/* Candidate Track Toggle */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-main)]">Your Background Track</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRegTrack('student_fresher');
                          setRegCurrentRole('Student / Recent Graduate');
                          setRegYears(0);
                          setRegExp('Junior (0-2 yrs)');
                          setRegTargetSalary('$95,000 - $125,000 Base ($140k+ TC)');
                          setRegSkills('Python, SQL, Machine Learning, Pandas, Scikit-Learn, Git');
                          setRegIndustry('Technology & AI');
                        }}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          regTrack === 'student_fresher'
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                            : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-muted)]'
                        }`}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Student & Fresher</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRegTrack('experienced');
                          setRegCurrentRole('Software Engineer');
                          setRegYears(3);
                          setRegExp('Mid-Level (3-5 yrs)');
                          setRegTargetSalary('$180,000 - $220,000 Base ($280k+ TC)');
                          setRegSkills('React, TypeScript, Node.js, System Design, SQL');
                          setRegIndustry('SaaS / Cloud Platforms');
                        }}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          regTrack === 'experienced'
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-muted)]'
                        }`}
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Experienced</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-main)] flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-[var(--text-muted)]" />
                        Current Role
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Frontend Engineer"
                        value={regCurrentRole}
                        onChange={(e) => setRegCurrentRole(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-main)] flex items-center gap-1">
                        <Target className="w-3 h-3 text-[var(--text-muted)]" />
                        Target Role Chosen
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Staff Full Stack Engineer"
                        value={regTargetRole}
                        onChange={(e) => setRegTargetRole(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-main)] flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-[var(--text-muted)]" />
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="35"
                        value={regYears}
                        onChange={(e) => setRegYears(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-main)]">Seniority Level</label>
                      <select
                        value={regExp}
                        onChange={(e) => setRegExp(e.target.value as ExperienceLevel)}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                      >
                        <option value="Junior (0-2 yrs)">Junior (0-2 yrs)</option>
                        <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                        <option value="Senior (6-8 yrs)">Senior (6-8 yrs)</option>
                        <option value="Lead / Staff (9-12 yrs)">Lead / Staff (9-12 yrs)</option>
                        <option value="Principal / Exec (12+ yrs)">Principal / Exec (12+ yrs)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--text-main)] flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[var(--text-muted)]" />
                      Core Technical Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React, TypeScript, Python, System Design, SQL, Docker"
                      value={regSkills}
                      onChange={(e) => setRegSkills(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-main)] flex items-center gap-1">
                        <Building className="w-3 h-3 text-[var(--text-muted)]" />
                        Industry / Domain
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SaaS / FinTech"
                        value={regIndustry}
                        onChange={(e) => setRegIndustry(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-main)] flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-[var(--text-muted)]" />
                        Target Comp ($)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. $220,000+ TC"
                        value={regTargetSalary}
                        onChange={(e) => setRegTargetSalary(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="py-2.5 px-3 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>Generate Personalized Career Plan</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>Career plans include curated YouTube & practice test links</span>
        </div>

      </div>
    </div>
  );
}
