import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'purple' | 'outline';
}

export function Badge({ className, variant = 'primary', children, ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-primary-500/15 text-primary-300 border border-primary-500/30',
    secondary: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl glass-card text-slate-100 p-5 transition-all shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
