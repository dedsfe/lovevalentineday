import { cn } from '@/lib/cn';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-black uppercase tracking-wide rounded-2xl border-2 border-ink transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          // shadow: bottom border illusion
          'border-b-[4px]',
          {
            // variants
            'bg-brand text-white hover:bg-brand-dark neo-shadow':
              variant === 'primary',
            'bg-surface text-ink hover:bg-subtle neo-shadow':
              variant === 'secondary',
            'bg-transparent border-transparent shadow-none hover:bg-subtle':
              variant === 'ghost',
            // sizes
            'text-[10px] px-4 py-2': size === 'sm',
            'text-xs px-5 py-3':     size === 'md',
            'text-sm px-7 py-4':     size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export { Button };
