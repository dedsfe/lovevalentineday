import { cn } from '@/lib/cn';
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-bold text-ink-muted uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-xl border-2 border-ink bg-surface px-3 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted/50',
            'focus:outline-none focus:neo-shadow transition-all',
            'neo-shadow-sm',
            className
          )}
          {...props}
        />
        {hint && <p className="text-[11px] text-ink-muted font-medium">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-bold text-ink-muted uppercase tracking-wide">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-xl border-2 border-ink bg-surface px-3 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted/50 resize-none',
            'focus:outline-none neo-shadow-sm transition-all',
            className
          )}
          {...props}
        />
        {hint && <p className="text-[11px] text-ink-muted font-medium">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
