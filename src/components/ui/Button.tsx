import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none rounded-lg select-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30 border border-primary-500/30',
      secondary: 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 hover:border-slate-600',
      outline: 'bg-transparent hover:bg-slate-800/60 text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white',
      ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
      danger: 'bg-red-600/80 hover:bg-red-500 text-white border border-red-500/30 shadow-md shadow-red-900/20',
      gradient: 'bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-400/30',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-3.5 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
      icon: 'p-2 w-9 h-9',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
