import React from 'react';
import { 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Cpu, 
  Users, 
  Mail, 
  Send, 
  Sparkles,
  Award,
  Briefcase
} from 'lucide-react';
import { AppMode } from '@/lib/types';
import { STARTER_PROMPTS } from '@/lib/constants';

interface QuickStartersProps {
  mode: AppMode;
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export function QuickStarters({ mode, onSelectPrompt, disabled }: QuickStartersProps) {
  const starters = STARTER_PROMPTS[mode] || STARTER_PROMPTS.strategy;

  const iconMap: Record<string, any> = {
    Target,
    Cpu,
    Users,
    MessageSquare,
    FileText,
    Mail,
    Send,
    Award,
    Briefcase,
    TrendingUp,
    DollarSign,
    Sparkles
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto w-full pt-2">
      {starters.slice(0, 4).map((item, index) => {
        const Icon = iconMap[item.icon] || Sparkles;
        return (
          <button
            key={index}
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group p-4 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-left transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-semibold text-[var(--text-main)] line-clamp-1">
                {item.label}
              </span>
              <Icon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors shrink-0" />
            </div>
            <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
              {item.prompt}
            </p>
          </button>
        );
      })}
    </div>
  );
}
