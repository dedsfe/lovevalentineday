import { cn } from '@/lib/cn';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shadow?: 'sm' | 'md' | 'lg' | 'brand' | 'none';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, shadow = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[1.5rem] border-2 border-ink bg-surface',
          {
            'neo-shadow-sm':    shadow === 'sm',
            'neo-shadow':       shadow === 'md',
            'neo-shadow-lg':    shadow === 'lg',
            'neo-shadow-brand': shadow === 'brand',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export { Card };
