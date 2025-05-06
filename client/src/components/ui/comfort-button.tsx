import React from 'react';
import { Button, type ButtonProps } from './button';
import { MicroAnimation } from './micro-animation';
import { cn } from '@/lib/utils';

export interface ComfortButtonProps extends ButtonProps {
  emotionalState?: 'success' | 'warning' | 'error' | 'neutral' | 'empathetic' | 'calming' | 'encouraging';
  pulseOnMount?: boolean;
  pulseOnHover?: boolean;
  pulseEffect?: boolean;
  children: React.ReactNode;
}

export function ComfortButton({
  emotionalState = 'neutral',
  pulseOnMount = false,
  pulseOnHover = true,
  pulseEffect = true,
  className,
  children,
  ...props
}: ComfortButtonProps) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [key, setKey] = React.useState(0);

  // Map emotional state to button variant
  const variantMap: Record<string, "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"> = {
    success: 'default',
    warning: 'default',
    error: 'destructive',
    neutral: 'default',
    empathetic: 'outline',
    calming: 'secondary',
    encouraging: 'default',
  };

  // Add specific class names based on emotional state
  const stateClassNames = {
    success: '',
    warning: '',
    error: '',
    neutral: '',
    empathetic: 'border-blue-400 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-950',
    calming: 'border-teal-400 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:border-teal-600 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-900',
    encouraging: 'border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:bg-yellow-950 dark:text-yellow-300 dark:hover:bg-yellow-900',
  };

  // Need the hover div to ensure animations work 
  // (as Button component already has hover effects)
  return (
    <div
      onMouseEnter={() => {
        if (pulseOnHover) {
          setIsHovering(true);
          setKey(prev => prev + 1);
        }
      }}
      onMouseLeave={() => setIsHovering(false)}
      className="inline-block"
    >
      <MicroAnimation
        key={key}
        variant={emotionalState}
        playOnMount={pulseOnMount}
        trigger={isHovering && pulseOnHover}
        className="inline-block"
      >
        <Button
          variant={props.variant || variantMap[emotionalState]}
          className={cn(
            pulseEffect && 'transition-all duration-300',
            stateClassNames[emotionalState],
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </MicroAnimation>
    </div>
  );
}
