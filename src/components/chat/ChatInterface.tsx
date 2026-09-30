import React, { useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Compass,
} from 'lucide-react';
import { AppMode, ChatMessage as ChatMessageType, GeneratedDocument, UserProfile } from '@/lib/types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickStarters } from './QuickStarters';
import { MockInterviewPanel } from '../interview/MockInterviewPanel';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onStopGeneration?: () => void;
  currentMode: AppMode;
  userProfile: UserProfile;
  onOpenDocument: (doc: GeneratedDocument) => void;
  onOpenProfile: () => void;
  onOpenAssessment?: () => void;
  onModeChange?: (mode: AppMode) => void;
}

export function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  onStopGeneration,
  currentMode,
  userProfile,
  onOpenDocument,
  onOpenProfile,
  onOpenAssessment,
  onModeChange,
}: ChatInterfaceProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] transition-colors">
      
      {/* Mock Interview Specialized Controller (if interview mode) */}
      {currentMode === 'interview' && (
        <MockInterviewPanel
          userProfile={userProfile}
          onSendPrompt={onSendMessage}
          isLoading={isLoading}
        />
      )}

      {/* Messages Scroll Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4 scroll-smooth"
      >
        {/* 16-Question Career Diagnostic Pill */}
        {onOpenAssessment && (
          <div className="max-w-3xl mx-auto w-full pb-1">
            <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-[var(--text-main)] block">
                    {userProfile.candidateTrack === 'student_fresher' ? '🎓 Student & Fresher Track' : '💼 Experienced Professional Track'} ({userProfile.targetRoles?.[0] || 'Target Role'})
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    All chatbot recommendations and roadmaps are personalized to your 16 diagnostic answers.
                  </span>
                </div>
              </div>
              <button
                onClick={onOpenAssessment}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs whitespace-nowrap shadow-xs transition-colors self-start sm:self-auto"
              >
                Edit 16 Questions
              </button>
            </div>
          </div>
        )}

        {/* Welcome Empty State - Gemini-style */}
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto text-center space-y-6 pt-10 sm:pt-16 pb-6 px-4 animate-fade-in-up">
            
            {/* Greeting */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--text-main)] tracking-tight">
                Hello, <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{userProfile.fullName}</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-muted)]">
                How can I help you today?
              </h2>
            </div>

            {/* Profile Quick Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Targeting <strong>{userProfile.targetRoles?.[0] || 'Target Role'}</strong> at <strong>{userProfile.targetCompanies?.[0] || 'Tier-1 Tech'}</strong></span>
              <button
                onClick={onOpenProfile}
                className="underline font-semibold ml-1 text-[var(--text-main)]"
              >
                Edit
              </button>
            </div>

            {/* 2x2 Career Starter Prompt Cards */}
            <div className="pt-2">
              <QuickStarters
                mode={currentMode}
                onSelectPrompt={onSendMessage}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Conversation Thread */}
        {messages.map((message, idx) => (
          <ChatMessage
            key={message.id || idx}
            message={message}
            onOpenDocument={onOpenDocument}
            isLatest={idx === messages.length - 1}
            userProfile={userProfile}
          />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="w-full max-w-3xl mx-auto flex gap-4 px-2 sm:px-4 py-2">
            <div className="w-7 h-7 rounded-full bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Input Capsule */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        onStop={onStopGeneration}
        currentMode={currentMode}
        onModeChange={onModeChange}
      />

    </div>
  );
}
