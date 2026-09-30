import React, { useState } from 'react';
import { 
  Sparkles, 
  PanelLeft, 
  Plus, 
  ChevronDown, 
  Users, 
  Settings, 
  BrainCircuit, 
  Flame, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Eraser,
  Monitor,
  Tablet,
  Smartphone,
  Moon,
  Sun,
  Palette,
  Mic,
  Cpu,
  Globe,
  Trello,
  HeartHandshake,
  Compass
} from 'lucide-react';
import { AppMode, AppSettings, PlatformView, ThemeMode, UserAccount } from '@/lib/types';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  currentUser: UserAccount;
  themeMode: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  platformView: PlatformView;
  onPlatformChange: (view: PlatformView) => void;
  onOpenProfile: () => void;
  onOpenAssessment?: () => void;
  onOpenSettings: () => void;
  onOpenAuthModal: () => void;
  onNewChat: () => void;
  onClearCurrentChat: () => void;
  onToggleSidebar: () => void;
  settings: AppSettings;
}

export function Header({
  currentMode,
  onModeChange,
  currentUser,
  themeMode,
  onThemeChange,
  platformView,
  onPlatformChange,
  onOpenProfile,
  onOpenAssessment,
  onOpenSettings,
  onOpenAuthModal,
  onNewChat,
  onClearCurrentChat,
  onToggleSidebar,
  settings,
}: HeaderProps) {
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const modeBadges: Record<AppMode, { label: string; icon: any }> = {
    strategy: { label: 'Career Strategy', icon: BrainCircuit },
    interview: { label: 'Mock Interview (STAR)', icon: Flame },
    audio_interview: { label: 'Live Audio & Vision', icon: Mic },
    sandbox: { label: 'Tech Architecture Sandbox', icon: Cpu },
    market_intel: { label: 'Market Intelligence (RAG)', icon: Globe },
    kanban: { label: 'Opportunity Pipeline', icon: Trello },
    studio: { label: 'Document Studio', icon: FileText },
    roadmap: { label: 'Career Roadmap', icon: TrendingUp },
    negotiation: { label: 'Comp & Tax Lab', icon: DollarSign },
    on_the_job: { label: 'On-the-Job Companion', icon: HeartHandshake },
  };

  const currentBadge = modeBadges[currentMode] || modeBadges.strategy;
  const Icon = currentBadge.icon;

  const isBwDark = themeMode === 'bw-dark';
  const isBwLight = themeMode === 'bw-light';

  return (
    <header className="h-14 border-b border-[var(--border-color)] bg-[var(--bg-main)] px-3 sm:px-5 flex items-center justify-between sticky top-0 z-20 select-none transition-colors">
      
      {/* Left: Sidebar Toggle & Model/Mode Dropdown */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          title="Toggle sidebar"
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Career Intelligence Model Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowModelMenu(!showModelMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[var(--bg-surface-hover)] text-[var(--text-main)] transition-colors group"
          >
            <div className="w-5 h-5 rounded-md bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center font-bold text-xs shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm sm:text-base tracking-tight">
              Apex 4o
            </span>
            <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
              • {currentBadge.label}
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
          </button>

          {showModelMenu && (
            <div 
              className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl py-1.5 z-40 animate-fade-in-up"
              onClick={() => setShowModelMenu(false)}
            >
              <div className="px-3.5 py-2 border-b border-[var(--border-color)]">
                <p className="text-xs font-semibold text-[var(--text-main)]">Coaching Modes</p>
                <p className="text-[11px] text-[var(--text-muted)]">Select target career coaching domain</p>
              </div>

              <div className="p-1 space-y-0.5">
                {(Object.keys(modeBadges) as AppMode[]).map((m) => {
                  const item = modeBadges[m];
                  const ItemIcon = item.icon;
                  const isActive = currentMode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        onModeChange(m);
                        setShowModelMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 px-3 rounded-xl text-left text-xs transition-colors ${
                        isActive 
                          ? 'bg-[var(--bg-surface-hover)] font-semibold text-[var(--text-main)]' 
                          : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ItemIcon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--bg-accent)]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Multi-Platform View Switcher */}
      <div className="hidden md:flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-color)] shadow-sm">
        <button
          onClick={() => onPlatformChange('desktop')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            platformView === 'desktop'
              ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
          title="Full Desktop View"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>

        <button
          onClick={() => onPlatformChange('tablet')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            platformView === 'tablet'
              ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
          title="Tablet View (iPad 768px)"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>

        <button
          onClick={() => onPlatformChange('mobile')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            platformView === 'mobile'
              ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
          title="Mobile View (iPhone 390px)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>
      </div>

      {/* Right: Theme Toggle, New Chat, Accounts */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        
        {/* Black & White Theme Toggle Mode Menu */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            title="Toggle Black & White / ChatGPT Theme"
          >
            {isBwDark ? (
              <Moon className="w-3.5 h-3.5 text-white" />
            ) : isBwLight ? (
              <Sun className="w-3.5 h-3.5 text-black" />
            ) : (
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="hidden sm:inline font-medium">
              {isBwDark ? 'B&W Dark' : isBwLight ? 'B&W Light' : 'ChatGPT'}
            </span>
            <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
          </button>

          {showThemeMenu && (
            <div 
              className="absolute top-full right-0 mt-1 w-48 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl py-1 z-40 animate-fade-in-up"
              onClick={() => setShowThemeMenu(false)}
            >
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[var(--text-muted)] border-b border-[var(--border-color)]">
                Theme Toggle Mode
              </div>

              <button
                onClick={() => {
                  onThemeChange('bw-dark');
                  setShowThemeMenu(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                  themeMode === 'bw-dark' 
                    ? 'bg-[var(--bg-surface-hover)] text-[var(--text-main)] font-semibold' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-black border border-white" />
                  <span>B&W Dark (Monochrome)</span>
                </div>
                {themeMode === 'bw-dark' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>

              <button
                onClick={() => {
                  onThemeChange('bw-light');
                  setShowThemeMenu(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                  themeMode === 'bw-light' 
                    ? 'bg-[var(--bg-surface-hover)] text-[var(--text-main)] font-semibold' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white border border-black" />
                  <span>B&W Light (Paper)</span>
                </div>
                {themeMode === 'bw-light' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
              </button>

              <button
                onClick={() => {
                  onThemeChange('chatgpt');
                  setShowThemeMenu(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                  themeMode === 'chatgpt' 
                    ? 'bg-[var(--bg-surface-hover)] text-[var(--text-main)] font-semibold' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#10a37f]" />
                  <span>ChatGPT Classic</span>
                </div>
                {themeMode === 'chatgpt' && <span className="w-1.5 h-1.5 rounded-full bg-[#10a37f]" />}
              </button>
            </div>
          )}
        </div>

        {/* 16-Question Career Diagnostic Button */}
        {onOpenAssessment && (
          <button
            onClick={onOpenAssessment}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 text-xs font-semibold transition-colors"
            title="Open 16-Question Career Diagnostic"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">16-Q Diagnostic</span>
          </button>
        )}

        {/* Clear Current Section */}
        <button
          onClick={onClearCurrentChat}
          title="Clear current chat messages"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] text-xs transition-colors"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Clear</span>
        </button>

        {/* + New Chat */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs shadow-sm hover:opacity-90 transition-opacity"
          title="Start fresh conversation section"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* User Switcher */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs transition-colors"
          title={`Active User: ${currentUser?.name || 'User'}. Click to switch user or register`}
        >
          <div className="w-5 h-5 rounded-full bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center text-[10px] font-bold">
            {currentUser?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-[var(--text-main)] hidden xl:inline max-w-[80px] truncate">
            {currentUser?.name || 'Account'}
          </span>
          <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Settings & API Key"
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
}
