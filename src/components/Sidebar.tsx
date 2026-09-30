import React, { useState } from 'react';
import { 
  SquarePen, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  BrainCircuit, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  User, 
  LogOut, 
  Users, 
  ChevronUp, 
  Sparkles,
  Flame,
  Plus,
  Mic,
  Cpu,
  Globe,
  Trello,
  HeartHandshake
} from 'lucide-react';
import { AppMode, ChatSession, UserAccount } from '@/lib/types';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  currentUser: UserAccount;
  chatSessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onOpenProfile: () => void;
  onOpenAuthModal: () => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onToggleSidebar: () => void;
}

export function Sidebar({
  currentMode,
  onModeChange,
  currentUser,
  chatSessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onOpenProfile,
  onOpenAuthModal,
  onOpenSettings,
  isOpen,
  onToggleSidebar,
}: SidebarProps) {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setRenameValue(session.title);
  };

  const handleSaveRename = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (renameValue.trim()) {
      onRenameSession(sessionId, renameValue.trim());
    }
    setEditingSessionId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(null);
  };

  const coachingModes: { mode: AppMode; label: string; icon: any }[] = [
    { mode: 'strategy', label: 'Career Strategy', icon: BrainCircuit },
    { mode: 'interview', label: 'Mock Interview (STAR)', icon: Flame },
    { mode: 'audio_interview', label: 'Live Audio & Vision', icon: Mic },
    { mode: 'sandbox', label: 'Tech & Architecture', icon: Cpu },
    { mode: 'market_intel', label: 'Market Intel (RAG)', icon: Globe },
    { mode: 'kanban', label: 'Opportunity Funnel', icon: Trello },
    { mode: 'studio', label: 'Resume & Studio', icon: FileText },
    { mode: 'roadmap', label: '30-60-90 Roadmap', icon: TrendingUp },
    { mode: 'negotiation', label: 'Comp & Tax Lab', icon: DollarSign },
    { mode: 'on_the_job', label: 'On-the-Job & Brag', icon: HeartHandshake },
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 sm:w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col justify-between h-full select-none shrink-0 z-30 transition-colors">
      
      {/* Top Header & New Chat Button */}
      <div className="p-3 space-y-3">
        {/* Brand Bar */}
        <div className="flex items-center justify-between px-2 pt-1 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-[var(--text-main)] tracking-tight">Apex Career AI</span>
              <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] font-mono">
                GPT-4o
              </span>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-between p-2.5 px-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-main)] transition-all text-xs font-medium group shadow-sm"
          title="Clear current section and start a new career conversation"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center transition-colors">
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span>New career chat</span>
          </div>
          <SquarePen className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
        </button>

        {/* Quick Coaching Modes */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] px-2 tracking-wider">
            Specialized Modes
          </p>
          <div className="space-y-0.5">
            {coachingModes.map((item) => {
              const Icon = item.icon;
              const isActive = currentMode === item.mode;
              return (
                <button
                  key={item.mode}
                  onClick={() => onModeChange(item.mode)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                    isActive 
                      ? 'bg-[var(--bg-surface-hover)] text-[var(--text-main)] font-semibold' 
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle: Career Chat Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] px-2 mb-1.5 tracking-wider">
            Recent Conversations
          </p>

          {chatSessions.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-[var(--text-muted)]">
              <MessageSquare className="w-5 h-5 mx-auto mb-1.5 opacity-60" />
              <span>No saved chats yet.</span>
              <p className="text-[11px] opacity-75 mt-1">Start a conversation above.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chatSessions.map((session) => {
                const isActive = activeSessionId === session.id;
                const isEditing = editingSessionId === session.id;

                return (
                  <div
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`group relative flex items-center justify-between p-2 px-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[var(--bg-surface-hover)] text-[var(--text-main)] font-semibold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="w-full bg-[var(--bg-surface)] text-[var(--text-main)] px-2 py-0.5 rounded text-xs border border-[var(--border-color)] focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(session.id, e as any);
                            if (e.key === 'Escape') handleCancelRename(e as any);
                          }}
                        />
                        <button
                          onClick={(e) => handleSaveRename(session.id, e)}
                          className="p-1 hover:text-[var(--text-main)]"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="p-1 hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`} />
                          <span className="truncate">{session.title || 'Untitled Session'}</span>
                        </div>

                        {/* Hover Action buttons */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0 ml-1">
                          <button
                            onClick={(e) => startRename(session, e)}
                            title="Rename chat"
                            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            title="Delete chat"
                            className="p-1 text-[var(--text-muted)] hover:text-rose-500 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Account Footer & User Popover */}
      <div className="p-3 border-t border-[var(--border-color)] relative">
        {showUserMenu && (
          <div 
            className="absolute bottom-full left-3 right-3 mb-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl p-1.5 space-y-1 text-xs z-50 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-2 border-b border-[var(--border-color)]">
              <p className="font-semibold text-[var(--text-main)] truncate">{currentUser?.name || 'Alex Morgan'}</p>
              <p className="text-[11px] text-[var(--text-muted)] truncate">{currentUser?.email || 'alex@apex.ai'}</p>
              <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">
                {currentUser?.profile?.currentRole || 'Career Professional'}
              </p>
            </div>

            <button
              onClick={() => {
                setShowUserMenu(false);
                onOpenProfile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Career Context & Profile</span>
            </button>

            <button
              onClick={() => {
                setShowUserMenu(false);
                onOpenAuthModal();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Switch User / Accounts</span>
            </button>

            <button
              onClick={() => {
                setShowUserMenu(false);
                onOpenSettings();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings & Engine</span>
            </button>

            <div className="border-t border-[var(--border-color)] my-1" />

            <button
              onClick={() => {
                setShowUserMenu(false);
                onOpenAuthModal();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out / Switch persona</span>
            </button>
          </div>
        )}

        {/* User Profile Capsule Button */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--bg-surface-hover)] transition-colors text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {currentUser?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--text-main)] truncate">
                {currentUser?.name || 'Alex Morgan'}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">
                {currentUser?.profile?.currentRole || 'Career Professional'}
              </p>
            </div>
          </div>
          <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-main)] shrink-0 ml-1" />
        </button>
      </div>

    </aside>
  );
}
