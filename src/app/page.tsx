'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  AppMode, 
  AppSettings, 
  ChatMessage as ChatMessageType, 
  ChatSession,
  GeneratedDocument, 
  PlatformView, 
  ThemeMode, 
  UserAccount, 
  UserProfile 
} from '@/lib/types';
import { 
  loadStoredSettings, 
  saveStoredSettings 
} from '@/lib/storage';
import { 
  getCurrentUser, 
  updateActiveUserData 
} from '@/lib/auth';
import { 
  extractDocumentFromMarkdown, 
  parseStarFeedbackFromText 
} from '@/lib/utils';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ProfileDrawer } from '@/components/ProfileDrawer';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { DocumentStudio } from '@/components/studio/DocumentStudio';
import { SkillGapRoadmap } from '@/components/roadmap/SkillGapRoadmap';
import { OfferCalculator } from '@/components/negotiation/OfferCalculator';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { DeviceFrame } from '@/components/platform/DeviceFrame';
import { LiveAudioInterview } from '@/components/audio/LiveAudioInterview';
import { TechnicalSandbox } from '@/components/sandbox/TechnicalSandbox';
import { MarketIntelligence } from '@/components/market/MarketIntelligence';
import { ApplicationKanban } from '@/components/kanban/ApplicationKanban';
import { OnTheJobCompanion } from '@/components/companion/OnTheJobCompanion';
import { redactPII } from '@/lib/pii-vault';
import { saveEpisodicMemory } from '@/lib/episodic-memory';
import { MockInterviewStudio } from '@/components/interview/MockInterviewStudio';
import { CareerAssessmentModal } from '@/components/profile/CareerAssessmentModal';
import { generateCareerPlanFromProfile } from '@/lib/ai-stream';
import { Sparkles } from 'lucide-react';

export default function ApexHome() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => getCurrentUser());
  const [currentMode, setCurrentMode] = useState<AppMode>('strategy');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [savedDocs, setSavedDocs] = useState<GeneratedDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<GeneratedDocument | undefined>(undefined);
  const [settings, setSettings] = useState<AppSettings>(() => loadStoredSettings());
  
  // Theme & Multi-Platform States
  const [themeMode, setThemeMode] = useState<ThemeMode>('bw-light');
  const [platformView, setPlatformView] = useState<PlatformView>('desktop');

  // UI Panels State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Apply theme class to document element dynamically
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('theme-bw-dark', 'theme-bw-light', 'theme-chatgpt', 'dark', 'light');

      if (themeMode === 'bw-dark') {
        root.classList.add('dark', 'theme-bw-dark');
      } else if (themeMode === 'bw-light') {
        root.classList.add('light', 'theme-bw-light');
      } else {
        root.classList.add('dark', 'theme-chatgpt');
      }
    }
  }, [themeMode]);

  // Adjust sidebar default when in mobile/tablet view
  useEffect(() => {
    if (platformView === 'mobile') {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [platformView]);

  // Initialize active user & their chat sessions on client mount
  useEffect(() => {
    setIsMounted(true);
    const stored = loadStoredSettings();
    setSettings(stored);
    setThemeMode(stored.themeMode || 'bw-light');
    setPlatformView(stored.platformView || 'desktop');

    const user = getCurrentUser();

    // Auto-normalize student user plan if needed
    if (/student|fresher|intern/i.test(user.profile.currentRole || '')) {
      user.profile.candidateTrack = 'student_fresher';
      user.profile.yearsOfExperience = 0;
      user.profile.experienceLevel = 'Junior (0-2 yrs)';
      if (user.chatSessions && user.chatSessions.length > 0 && user.chatSessions[0].messages?.length > 0) {
        const msgs = user.chatSessions[0].messages;
        if (msgs[0].content.includes('3 YOE') || msgs[0].content.includes('3 years in SaaS') || msgs[0].content.includes('2+ pods')) {
          msgs[0].content = generateCareerPlanFromProfile(user.profile);
        }
        // Ensure user message is at the top of the chat
        if (!msgs.some(m => m.role === 'user')) {
          user.chatSessions[0].messages = [
            {
              id: 'msg_u_init',
              role: 'user',
              content: `Generate my strategic career roadmap for ${user.profile.targetRoles?.[0] || 'data scientist'} based on my diagnostic answers.`,
              createdAt: '10:00 AM',
              mode: 'strategy'
            },
            ...msgs
          ];
        }
      }
      updateActiveUserData(user);
    }

    setCurrentUser(user);
    const sessions = user.chatSessions || [];
    if (sessions.length > 0) {
      setActiveSessionId(sessions[0].id);
      setMessages(sessions[0].messages || []);
      setCurrentMode(sessions[0].mode || 'strategy');
    } else {
      handleNewChat();
    }

    const docs = user.documents || [];
    setSavedDocs(docs);
    if (docs.length > 0) setActiveDoc(docs[0]);
  }, []);

  // Save assessment answers from 16-Question modal and regenerate plan based strictly on answers
  const handleSaveAssessment = (updatedProfile: Partial<UserProfile>, triggerNewPlan: boolean = true) => {
    const nextProfile: UserProfile = {
      ...currentUser.profile,
      ...updatedProfile
    };
    const nextUser: UserAccount = {
      ...currentUser,
      profile: nextProfile
    };

    if (triggerNewPlan) {
      const freshPlan = generateCareerPlanFromProfile(nextProfile);
      const userPromptText = `Generate my personalized strategic career roadmap for ${nextProfile.targetRoles?.[0] || 'Target Role'} based on my 16 diagnostic answers.`;
      
      const userMsg: ChatMessageType = {
        id: 'msg_user_' + Date.now(),
        role: 'user',
        content: userPromptText,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'strategy'
      };

      const assistantMsg: ChatMessageType = {
        id: 'msg_plan_' + (Date.now() + 1),
        role: 'assistant',
        content: freshPlan,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'strategy'
      };

      const planMessages = [userMsg, assistantMsg];
      setMessages(planMessages);

      const sessionTitle = `Career Plan: ${nextProfile.targetRoles?.[0] || 'Target Role'}`;
      const existingSessions = nextUser.chatSessions || [];
      const updatedSessions: ChatSession[] = existingSessions.length > 0
        ? existingSessions.map((s, idx) => idx === 0 ? { ...s, title: sessionTitle, messages: planMessages, updatedAt: 'Just now' } : s)
        : [{
            id: 'session_' + Date.now(),
            title: sessionTitle,
            mode: 'strategy' as AppMode,
            messages: planMessages,
            createdAt: 'Just now',
            updatedAt: 'Just now'
          }];

      nextUser.chatSessions = updatedSessions;
      triggerCelebration();
    }

    setCurrentUser(nextUser);
    updateActiveUserData(nextUser);
  };

  // Save changes to current user in localStorage
  const syncUserData = (updated: Partial<UserAccount>) => {
    const nextUser: UserAccount = { ...currentUser, ...updated };
    setCurrentUser(nextUser);
    updateActiveUserData(nextUser);
  };

  // Switch to another user account (multi-user)
  const handleUserChanged = (newUser: UserAccount) => {
    setCurrentUser(newUser);
    const sessions = newUser.chatSessions || [];
    if (sessions.length > 0) {
      setActiveSessionId(sessions[0].id);
      setMessages(sessions[0].messages || []);
      setCurrentMode(sessions[0].mode || 'strategy');
    } else {
      const freshId = 'session_' + Date.now();
      const freshSession: ChatSession = {
        id: freshId,
        title: 'New Career Chat',
        mode: 'strategy',
        messages: [],
        createdAt: 'Just now',
        updatedAt: 'Just now',
      };
      setActiveSessionId(freshId);
      setMessages([]);
      setCurrentMode('strategy');
      const updatedUser = { ...newUser, chatSessions: [freshSession] };
      setCurrentUser(updatedUser);
      updateActiveUserData(updatedUser);
    }

    const docs = newUser.documents || [];
    setSavedDocs(docs);
    setActiveDoc(docs.length > 0 ? docs[0] : undefined);
  };

  // Clear chatbot for new section / new conversation thread
  const handleNewChat = () => {
    if (activeSessionId && messages.length > 0) {
      const existingSessions = currentUser.chatSessions || [];
      const updatedSessions = existingSessions.map(s => 
        s.id === activeSessionId ? { ...s, messages, updatedAt: 'Just now' } : s
      );
      syncUserData({ chatSessions: updatedSessions });
    }

    const newSessionId = 'session_' + Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Career Chat',
      mode: currentMode,
      messages: [],
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };

    const nextSessions = [newSession, ...(currentUser.chatSessions || [])];
    setActiveSessionId(newSessionId);
    setMessages([]); // Cleared for new section!
    syncUserData({ chatSessions: nextSessions });
  };

  // Clear messages within current section
  const handleClearCurrentChat = () => {
    setMessages([]);
    if (activeSessionId) {
      const nextSessions = (currentUser.chatSessions || []).map(s =>
        s.id === activeSessionId ? { ...s, messages: [], updatedAt: 'Just now' } : s
      );
      syncUserData({ chatSessions: nextSessions });
    }
  };

  // Switch between conversation threads
  const handleSelectSession = (sessionId: string) => {
    if (sessionId === activeSessionId) return;

    if (activeSessionId && messages.length > 0) {
      const sessions = (currentUser.chatSessions || []).map(s =>
        s.id === activeSessionId ? { ...s, messages, updatedAt: 'Just now' } : s
      );
      syncUserData({ chatSessions: sessions });
    }

    const target = (currentUser.chatSessions || []).find(s => s.id === sessionId);
    if (target) {
      setActiveSessionId(target.id);
      setMessages(target.messages || []);
      setCurrentMode(target.mode || 'strategy');
    }

    // Auto-close sidebar on mobile
    if (platformView === 'mobile') {
      setIsSidebarOpen(false);
    }
  };

  // Delete a conversation thread
  const handleDeleteSession = (sessionId: string) => {
    const remaining = (currentUser.chatSessions || []).filter(s => s.id !== sessionId);
    syncUserData({ chatSessions: remaining });
    if (activeSessionId === sessionId) {
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
        setMessages(remaining[0].messages || []);
        setCurrentMode(remaining[0].mode || 'strategy');
      } else {
        handleNewChat();
      }
    }
  };

  // Rename a conversation thread
  const handleRenameSession = (sessionId: string, newTitle: string) => {
    const updated = (currentUser.chatSessions || []).map(s =>
      s.id === sessionId ? { ...s, title: newTitle } : s
    );
    syncUserData({ chatSessions: updated });
  };

  // Theme change
  const handleThemeChange = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    const updatedSettings = { ...settings, themeMode: newTheme };
    setSettings(updatedSettings);
    saveStoredSettings(updatedSettings);
  };

  // Platform view change
  const handlePlatformChange = (newPlatform: PlatformView) => {
    setPlatformView(newPlatform);
    const updatedSettings = { ...settings, platformView: newPlatform };
    setSettings(updatedSettings);
    saveStoredSettings(updatedSettings);
  };

  // Profile update
  const handleSaveProfile = (newProfile: UserProfile) => {
    syncUserData({ profile: newProfile });
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setThemeMode(newSettings.themeMode);
    setPlatformView(newSettings.platformView);
    saveStoredSettings(newSettings);
  };

  const handleUpdateDocument = (doc: GeneratedDocument) => {
    setActiveDoc(doc);
    const existing = currentUser.documents || [];
    const updated = existing.some(d => d.id === doc.id)
      ? existing.map(d => (d.id === doc.id ? doc : d))
      : [doc, ...existing];
    setSavedDocs(updated);
    syncUserData({ documents: updated });
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: themeMode.startsWith('bw') ? ['#ffffff', '#a1a1aa', '#52525b', '#000000'] : ['#10a37f', '#34d399', '#6366f1', '#38bdf8']
      });
    } catch (e) {
      // ignore
    }
  };

  // Handle switching between specialized coaching modes
  const handleModeChange = (newMode: AppMode) => {
    if (newMode === currentMode) return;

    // 1. Save current session before leaving
    if (activeSessionId && messages.length > 0) {
      const existingSessions = currentUser.chatSessions || [];
      const updatedSessions = existingSessions.map(s =>
        s.id === activeSessionId ? { ...s, messages, updatedAt: 'Just now' } : s
      );
      syncUserData({ chatSessions: updatedSessions });
    }

    setCurrentMode(newMode);

    // 2. Select or create an appropriate session for the new mode
    if (newMode === 'studio') {
      // Find existing studio session or create a dedicated Resume Copilot session
      const existingStudio = (currentUser.chatSessions || []).find(s => s.mode === 'studio');
      if (existingStudio && existingStudio.messages.length > 0 && !existingStudio.messages.some(m => m.content.includes('Personalized Early-Career Launchpad'))) {
        setActiveSessionId(existingStudio.id);
        setMessages(existingStudio.messages);
      } else {
        const studioId = 'session_studio_' + Date.now();
        const studioWelcomeMsg: ChatMessageType = {
          id: 'msg_studio_welcome',
          role: 'assistant',
          content: `### 📝 Welcome to ATS Resume & Document Studio!\n\nI am your dedicated **ATS Resume Optimization Copilot** for **${currentUser.profile.fullName}** targeting **${currentUser.profile.targetRoles?.[0] || 'Target Role'}**.\n\nI can help you:\n- **Quantify Project Impact**: Transform basic statements into metric-driven achievements (*e.g., "Trained model with 91.4% ROC-AUC, cutting latency by 45%"*).\n- **ATS Keyword Alignment**: Match your resume skills against live job postings to reach a **95%+ ATS score**.\n- **1-Page Compression**: Tighten phrasing and formatting for modern recruiter scanning.\n- **Generate Cover Letters & Outreach**: Draft tailored cover letters and recruiter LinkedIn DMs.\n\n*Type any bullet point, paste a job description, or select a quick action above to start!*`,
          createdAt: 'Just now',
          mode: 'studio'
        };
        const studioSession: ChatSession = {
          id: studioId,
          title: `Resume Copilot: ${currentUser.profile.targetRoles?.[0] || 'Target Role'}`,
          mode: 'studio',
          messages: [studioWelcomeMsg],
          createdAt: 'Just now',
          updatedAt: 'Just now'
        };
        setActiveSessionId(studioId);
        setMessages([studioWelcomeMsg]);
        syncUserData({ chatSessions: [studioSession, ...(currentUser.chatSessions || [])] });
      }
    } else {
      // Look for an existing session matching this mode
      const matchingSession = (currentUser.chatSessions || []).find(s => s.mode === newMode);
      if (matchingSession) {
        setActiveSessionId(matchingSession.id);
        setMessages(matchingSession.messages || []);
      } else {
        const firstSession = (currentUser.chatSessions || [])[0];
        if (firstSession) {
          setActiveSessionId(firstSession.id);
          setMessages(firstSession.messages || []);
        }
      }
    }
  };

  const handleNavigateToStudioWithJob = (job: any) => {
    const targetTitle = job.title;
    const targetCompany = job.company;
    const skillsList = Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : job.tags?.join(', ');

    const tailoredResume = `# ${currentUser.profile.fullName.toUpperCase()}
**${targetTitle} | Candidate**
Email: ${currentUser.profile.fullName.toLowerCase().replace(/\\s+/g, '.')}@example.com | LinkedIn: linkedin.com/in/${currentUser.profile.fullName.toLowerCase().replace(/\\s+/g, '')} | San Francisco, CA / Remote

---

## 🎯 TARGET OBJECTIVE
Targeting the **${targetTitle}** position at **${targetCompany}**. Offering proven expertise in **${skillsList}**, predictive machine learning, and high-impact analytical pipelines.

---

## 🛠️ CORE TECHNICAL PREREQUISITES
- **Verified Job Match**: ${skillsList}
- **Analytical & Programming**: Python (Pandas, NumPy, Scikit-Learn), SQL, R, Bash
- **Machine Learning & Modeling**: Supervised/Unsupervised Learning, Regression, Classification, Model Evaluation, Hyperparameter Tuning
- **Databases & Data Engineering**: PostgreSQL, Data Cleaning, Feature Engineering, ETL Pipelines

---

## 🔬 TARGET-ALIGNED PROJECTS & EXPERIENCE

### **Production Machine Learning Pipeline** | *Python, Scikit-Learn, Streamlit*
- Architected predictive classification pipeline aligned with **${targetCompany}** requirements, achieving 91.4% ROC-AUC on 120,000+ records.
- Engineered 16 domain features; evaluated feature importance using SHAP values.
- Deployed interactive Streamlit web dashboard enabling non-technical stakeholders to evaluate real-time model inferences.

### **Large-Scale Data Ingestion & SQL Modeling** | *PostgreSQL, Python, SQL*
- Authored complex analytical SQL queries (window functions, CTEs) to clean and transform 1.2M+ rows of real-world event data.
- Automated weekly data ingestion pipeline, reducing processing turnaround by 45%.

---

## 🎓 EDUCATION & COURSEWORK
**Bachelor of Science in Computer Science / Data Science**
*Expected Graduation: 2026*
- **Relevant Coursework**: Machine Learning, Applied Statistics, Data Structures & Algorithms, Database Systems`;

    const tailoredDoc: GeneratedDocument = {
      id: 'doc_' + Date.now(),
      title: `ATS Resume: ${targetCompany} (${targetTitle})`,
      type: 'resume',
      content: tailoredResume,
      targetRole: targetTitle,
      targetCompany: targetCompany,
      updatedAt: 'Just now'
    };

    handleUpdateDocument(tailoredDoc);
    handleModeChange('studio');
  };

  // Main streaming message engine
  const handleSendMessage = async (userPrompt: string) => {
    if (!userPrompt.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: userPrompt,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: currentMode,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    let sessionToUpdateId = activeSessionId;
    let existingSessions = currentUser.chatSessions || [];
    let currentSession = existingSessions.find(s => s.id === sessionToUpdateId);

    if (!sessionToUpdateId || !currentSession) {
      sessionToUpdateId = 'session_' + Date.now();
      setActiveSessionId(sessionToUpdateId);
      currentSession = {
        id: sessionToUpdateId,
        title: userPrompt.slice(0, 32).trim() + (userPrompt.length > 32 ? '...' : ''),
        mode: currentMode,
        messages: [userMessage],
        createdAt: 'Just now',
        updatedAt: 'Just now'
      };
      existingSessions = [currentSession, ...existingSessions];
      syncUserData({ chatSessions: existingSessions });
    } else {
      const generatedTitle = (currentSession.title === 'New Career Chat' || currentSession.messages.length === 0)
        ? userPrompt.slice(0, 32).trim() + (userPrompt.length > 32 ? '...' : '')
        : currentSession.title;
      currentSession.title = generatedTitle;
      currentSession.messages = [...currentSession.messages, userMessage];
      currentSession.updatedAt = 'Just now';
      syncUserData({ chatSessions: existingSessions });
    }

    const assistantMsgId = 'msg_apex_' + Date.now();
    let accumulatedContent = '';

    const initialAssistantMsg: ChatMessageType = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: currentMode,
    };

    setMessages([...newMessages, initialAssistantMsg]);

    try {
      abortControllerRef.current = new AbortController();

      const scrubbedMessages = newMessages.map((m, idx) => {
        if (settings.piiRedactionEnabled && m.role === 'user') {
          return { role: m.role, content: redactPII(m.content, currentUser.profile?.fullName).scrubbedText };
        }
        return { role: m.role, content: m.content };
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: scrubbedMessages,
          profile: currentUser.profile,
          mode: currentMode,
          customApiKey: settings.apiKey,
          provider: settings.apiProvider,
          interviewerArchetype: settings.interviewerArchetype || 'staff_architect',
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        accumulatedContent += text;

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsgId ? { ...m, content: accumulatedContent } : m
          )
        );
      }

      const starEvaluation = parseStarFeedbackFromText(accumulatedContent);
      const extractedDocument = extractDocumentFromMarkdown(accumulatedContent);

      if (extractedDocument) {
        handleUpdateDocument(extractedDocument);
        triggerCelebration();
      }

      if (starEvaluation && starEvaluation.overall >= 8) {
        triggerCelebration();
      }

      // Index into Vectorized Episodic Memory (Pillar 7)
      if (accumulatedContent.length > 50) {
        saveEpisodicMemory({
          topic: userPrompt.slice(0, 48),
          sessionType: currentMode === 'interview' ? 'mock_interview' : currentMode === 'studio' ? 'resume_iteration' : 'negotiation',
          summary: accumulatedContent.slice(0, 200).replace(/[\n#*]/g, ' ') + '...',
          tags: [currentMode, currentUser.profile.targetRoles[0] || 'Staff Engineer', settings.interviewerArchetype || 'Staff Architect']
        });
      }

      setMessages(prev => {
        const final = prev.map(m =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: accumulatedContent,
                starFeedback: starEvaluation,
                extractedDoc: extractedDocument,
              }
            : m
        );

        if (sessionToUpdateId) {
          const sessions = (currentUser.chatSessions || []).map(s =>
            s.id === sessionToUpdateId ? { ...s, messages: final, updatedAt: 'Just now' } : s
          );
          syncUserData({ chatSessions: sessions });
        }

        return final;
      });

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Chat error:', err);
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content:
                    accumulatedContent ||
                    '⚠️ Apex Career AI encountered an issue. Please try again.',
                }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  // Render workspace content inside layout
  const renderWorkspace = () => (
    <div className={`flex flex-col h-screen w-full overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] ${themeMode === 'bw-dark' ? 'theme-bw-dark' : themeMode === 'bw-light' ? 'theme-bw-light' : 'theme-chatgpt'}`}>
      
      {/* Top Navigation Header with B&W Toggle and Platform Switcher */}
      <Header
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        currentUser={currentUser}
        themeMode={themeMode}
        onThemeChange={handleThemeChange}
        platformView={platformView}
        onPlatformChange={handlePlatformChange}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAssessment={() => setIsAssessmentModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onNewChat={handleNewChat}
        onClearCurrentChat={handleClearCurrentChat}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        settings={settings}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar */}
        <Sidebar
          currentMode={currentMode}
          onModeChange={(mode) => {
            handleModeChange(mode);
            if (platformView === 'mobile') setIsSidebarOpen(false);
          }}
          currentUser={currentUser}
          chatSessions={currentUser.chatSessions || []}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onRenameSession={handleRenameSession}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Mobile Backdrop Overlay when sidebar is open */}
        {isSidebarOpen && platformView === 'mobile' && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-black/60 z-20 backdrop-blur-xs"
          />
        )}

        {/* Center Main Stage Content */}
        <main className="flex-1 flex overflow-hidden bg-[var(--bg-main)]">
          
          {/* General Strategy Coaching Mode */}
          {currentMode === 'strategy' && (
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onStopGeneration={handleStopGeneration}
              currentMode={currentMode}
              userProfile={currentUser.profile}
              onOpenDocument={(doc) => {
                setActiveDoc(doc);
                handleModeChange('studio');
              }}
              onOpenProfile={() => setIsProfileOpen(true)}
              onOpenAssessment={() => setIsAssessmentModalOpen(true)}
              onModeChange={handleModeChange}
            />
          )}

          {/* Dedicated Mock Interview Studio (Topic Selection + Embedded Live Video & Audio) */}
          {currentMode === 'interview' && (
            <MockInterviewStudio
              userProfile={currentUser.profile}
              initialMultimodal={false}
              onSwitchToStrategy={() => handleModeChange('strategy')}
            />
          )}

          {/* Document Studio Mode (Split Screen) */}
          {currentMode === 'studio' && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full min-h-0">
              {/* Left Chat Pane */}
              <div className="w-full lg:w-[45%] flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--border-color)] min-h-0 h-[50vh] lg:h-full overflow-hidden">
                <ChatInterface
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                  onStopGeneration={handleStopGeneration}
                  currentMode={currentMode}
                  userProfile={currentUser.profile}
                  onOpenDocument={(doc) => setActiveDoc(doc)}
                  onOpenProfile={() => setIsProfileOpen(true)}
                  onModeChange={handleModeChange}
                />
              </div>

              {/* Right ATS Document Editor & PDF Exporter */}
              <div className="w-full lg:w-[55%] flex flex-col overflow-hidden min-h-0 flex-1 lg:flex-none">
                <DocumentStudio
                  currentDocument={activeDoc}
                  userProfile={currentUser.profile}
                  onSendPrompt={handleSendMessage}
                  onUpdateDocument={handleUpdateDocument}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          {/* Skill Gap & Career Roadmap Mode - Full Width View */}
          {currentMode === 'roadmap' && (
            <div className="flex-1 overflow-y-auto bg-[var(--bg-main)] w-full h-full">
              <SkillGapRoadmap
                userProfile={currentUser.profile}
                onSendPrompt={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Compensation & Offer Negotiation Lab - Full Width View */}
          {currentMode === 'negotiation' && (
            <div className="flex-1 overflow-y-auto bg-[var(--bg-main)] w-full h-full">
              <OfferCalculator
                userProfile={currentUser.profile}
                onSendPrompt={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Pillar 1: Multimodal & Live Audio Interviewing */}
          {currentMode === 'audio_interview' && (
            <MockInterviewStudio
              userProfile={currentUser.profile}
              initialMultimodal={true}
              onSwitchToStrategy={() => handleModeChange('strategy')}
            />
          )}

          {/* Pillar 2: Live Technical & Architectural Sandboxes */}
          {currentMode === 'sandbox' && (
            <TechnicalSandbox
              userProfile={currentUser.profile}
            />
          )}

          {/* Pillar 3: Market Intelligence & Job Ingestion (RAG) */}
          {currentMode === 'market_intel' && (
            <MarketIntelligence
              userProfile={currentUser.profile}
              onSendChatPrompt={handleSendMessage}
              onUpdateUserProfile={handleSaveProfile}
              onNavigateToStudio={handleNavigateToStudioWithJob}
              onTrackInKanban={() => handleModeChange('kanban')}
            />
          )}

          {/* Pillar 4: Application Lifecycle & Opportunity Tracking */}
          {currentMode === 'kanban' && (
            <ApplicationKanban
              userProfile={currentUser.profile}
            />
          )}

          {/* Pillar 6: On-the-Job Companion & Longevity */}
          {currentMode === 'on_the_job' && (
            <OnTheJobCompanion
              userProfile={currentUser.profile}
            />
          )}

        </main>
      </div>

      {/* Multi-User Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChanged={handleUserChanged}
      />

      {/* Profile Context Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={currentUser.profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onClearChat={handleClearCurrentChat}
        userProfile={currentUser.profile}
        messages={messages}
      />

      {/* 16-Question Career Diagnostic Modal */}
      <CareerAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        userProfile={currentUser.profile}
        onSaveAssessment={handleSaveAssessment}
      />

    </div>
  );

  if (!isMounted) {
    return (
      <div className="h-screen w-screen bg-[var(--bg-main)] flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-sm text-[var(--text-muted)] animate-pulse">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-xs tracking-wider uppercase">Loading Apex Career AI...</span>
        </div>
      </div>
    );
  }

  return (
    <DeviceFrame
      platformView={platformView}
      onPlatformChange={handlePlatformChange}
    >
      {renderWorkspace()}
    </DeviceFrame>
  );
}
