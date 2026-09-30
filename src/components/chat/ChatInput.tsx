import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Square, 
  Mic, 
  MicOff, 
  Paperclip, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { AppMode } from '@/lib/types';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  currentMode: AppMode;
  onModeChange?: (mode: AppMode) => void;
  onUploadResume?: (text: string) => void;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  onStop,
  currentMode,
  onModeChange,
  onUploadResume,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  // Speech-to-text recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(prev => (prev ? prev + ' ' : '') + transcript);
        }
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setInput(prev => 
          prev 
            ? `${prev}\n\n[Uploaded Document: ${file.name}]\n${text.slice(0, 2000)}`
            : `Please analyze my document (${file.name}):\n\n${text.slice(0, 2000)}`
        );
        if (onUploadResume) onUploadResume(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const modeLabels: Record<AppMode, string> = {
    strategy: 'General Strategy',
    interview: 'Mock Interview (STAR)',
    studio: 'Document Studio',
    roadmap: 'Career Roadmap',
    negotiation: 'Comp & Negotiation',
    audio_interview: 'Live Audio & Vision',
    sandbox: 'Tech Architecture Sandbox',
    market_intel: 'Market Intelligence (RAG)',
    kanban: 'Opportunity Pipeline',
    on_the_job: 'On-the-Job & Longevity',
  };

  const modePlaceholders: Record<AppMode, string> = {
    strategy: 'Ask anything about career strategy, promotion milestones, or job transitions...',
    interview: 'Type your STAR interview response or ask for the next question...',
    studio: 'Ask to write or refine your resume, cover letter, or outreach pitch...',
    roadmap: 'Ask to benchmark your skills or build a 30-60-90 day execution plan...',
    negotiation: 'Ask for compensation leverage tactics, counter-offer emails, or equity breakdown...',
    audio_interview: 'Speak or type your interview answer for real-time speech telemetry...',
    sandbox: 'Ask about distributed architecture, system design chaos, or debugging triage...',
    market_intel: 'Paste a job description URL or ask for market tech volatility insights...',
    kanban: 'Ask to track applications, draft recruiter thank-you notes, or schedule debriefs...',
    on_the_job: 'Ask about 30-60-90 onboarding goals, logging brag sheets, or burnout pacing...',
  };

  const canSubmit = input.trim().length > 0 && !isLoading;

  return (
    <div className="w-full bg-[var(--bg-main)] px-4 pt-2 pb-4 transition-colors">
      <div className="max-w-3xl mx-auto space-y-2">
        
        {/* Floating Input Pill Container */}
        <div className={`relative rounded-[26px] bg-[var(--bg-input)] border transition-all duration-200 shadow-xl ${
          isListening 
            ? 'border-[var(--bg-accent)] ring-1 ring-[var(--bg-accent)]' 
            : 'border-[var(--border-color)] focus-within:border-[var(--text-main)]'
        }`}>

          {/* Voice Listening Bar */}
          {isListening && (
            <div className="px-4 py-1.5 border-b border-[var(--border-color)] bg-[var(--bg-surface-hover)] rounded-t-[25px] flex items-center justify-between text-xs text-[var(--text-main)]">
              <span className="flex items-center gap-1.5 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[var(--bg-accent)]" />
                Listening to your voice... Speak your response clearly.
              </span>
              <button
                type="button"
                onClick={toggleListening}
                className="underline hover:opacity-80"
              >
                Done
              </button>
            </div>
          )}

          {/* Text Area */}
          <div className="px-4 pt-3.5 pb-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={modePlaceholders[currentMode]}
              className="w-full bg-transparent text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none resize-none max-h-48 min-h-[44px] leading-relaxed"
            />
          </div>

          {/* Bottom Toolbar inside the pill */}
          <div className="px-3.5 pb-2.5 flex items-center justify-between">
            {/* Left buttons (Attach file, Mode selector) */}
            <div className="flex items-center gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach resume or job description (txt, md, doc)"
                className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Mode pill selector */}
              {onModeChange && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowModeDropdown(!showModeDropdown)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs text-[var(--text-main)] transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[var(--text-main)]" />
                    <span>{modeLabels[currentMode]}</span>
                    <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>

                  {showModeDropdown && (
                    <div 
                      className="absolute bottom-full left-0 mb-2 w-52 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl py-1 z-30 overflow-hidden animate-fade-in-up"
                      onClick={() => setShowModeDropdown(false)}
                    >
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[var(--text-muted)] border-b border-[var(--border-color)]">
                        Switch Coaching Mode
                      </div>
                      {(Object.keys(modeLabels) as AppMode[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            onModeChange(m);
                            setShowModeDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                            currentMode === m 
                              ? 'bg-[var(--bg-surface-hover)] text-[var(--text-main)] font-semibold' 
                              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                          }`}
                        >
                          <span>{modeLabels[m]}</span>
                          {currentMode === m && <span className="w-1.5 h-1.5 rounded-full bg-[var(--bg-accent)]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right buttons (Voice & Send) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-1.5 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] font-bold' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                }`}
                title="Dictate response with microphone"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {isLoading ? (
                <button
                  type="button"
                  onClick={onStop}
                  title="Stop generating"
                  className="w-8 h-8 rounded-full bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center transition-all shadow-md"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!canSubmit}
                  title="Send message"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                    canSubmit
                      ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] hover:opacity-90 cursor-pointer font-bold'
                      : 'bg-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
                  }`}
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-center text-[var(--text-muted)]">
          Apex AI Career Coach can make mistakes. Verify critical compensation numbers and company policies.
        </p>
      </div>
    </div>
  );
}
