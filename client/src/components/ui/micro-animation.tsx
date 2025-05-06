import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const emotionalStates = {
  // Success/positive animations
  success: {
    scale: [1, 1.05, 1],
    rotate: [0, 2, 0],
    transition: { duration: 0.5 },
  },
  // Comforting animations for warnings
  warning: {
    scale: [1, 1.03, 1],
    x: [0, 3, -3, 0],
    transition: { duration: 0.6 },
  },
  // Subtle animations for errors (careful not to increase anxiety)
  error: {
    scale: [1, 0.98, 1],
    opacity: [1, 0.9, 1],
    transition: { duration: 0.5 },
  },
  // Neutral/progress animations
  neutral: {
    scale: [1, 1.02, 1],
    transition: { duration: 0.5 },
  },
  // Empathetic animation for sensitive medical information
  empathetic: {
    scale: [1, 1.02, 1],
    transition: { duration: 0.8, ease: 'easeInOut' },
  },
  // Calming animation for stress-inducing moments
  calming: {
    opacity: [1, 0.95, 1],
    scale: [1, 0.99, 1, 1.01, 1],
    transition: { duration: 1, ease: 'easeInOut' },
  },
  // Encouraging animation for completing difficult tasks
  encouraging: {
    scale: [1, 1.06, 1],
    rotate: [0, 1, 0, -1, 0],
    transition: { duration: 0.7 },
  },
};

const microAnimationVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        success: 'text-success',
        warning: 'text-warning',
        error: 'text-error',
        neutral: 'text-primary',
        empathetic: 'text-blue-500',
        calming: 'text-teal-500',
        encouraging: 'text-yellow-500',
      },
      size: {
        default: 'h-auto w-auto',
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        icon: 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'default',
    },
  }
);

export interface MicroAnimationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof microAnimationVariants> {
  playOnMount?: boolean;
  playOnClick?: boolean;
  autoPlayDelay?: number;
  trigger?: boolean;
  repeat?: boolean | number;
  repeatDelay?: number;
}

export function MicroAnimation({
  children,
  className,
  variant = 'neutral',
  size,
  playOnMount = false,
  playOnClick = false,
  autoPlayDelay,
  trigger = false,
  repeat = false,
  repeatDelay = 0,
  ...props
}: MicroAnimationProps) {
  const [play, setPlay] = useState(playOnMount);
  const [key, setKey] = useState(0);

  // Handle controlled animations via trigger prop
  useEffect(() => {
    if (trigger) {
      setPlay(true);
      setKey(prev => prev + 1);
    }
  }, [trigger]);

  // Handle auto-play with delay
  useEffect(() => {
    if (autoPlayDelay && autoPlayDelay > 0) {
      const timer = setTimeout(() => {
        setPlay(true);
        setKey(prev => prev + 1);
      }, autoPlayDelay);
      return () => clearTimeout(timer);
    }
  }, [autoPlayDelay]);

  // Handle repeat animations
  useEffect(() => {
    if (!play || !repeat) return;

    const repeats = typeof repeat === 'number' ? repeat : Infinity;
    let count = 0;

    const interval = setInterval(() => {
      if (count >= repeats) {
        clearInterval(interval);
        return;
      }
      setKey(prev => prev + 1);
      count++;
    }, repeatDelay + (emotionalStates[variant]?.transition?.duration || 0.5) * 1000);

    return () => clearInterval(interval);
  }, [play, repeat, repeatDelay, variant]);

  const handleClick = () => {
    if (playOnClick) {
      setPlay(true);
      setKey(prev => prev + 1);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className={cn(microAnimationVariants({ variant, size, className }))}
        animate={play ? emotionalStates[variant] : {}}
        onClick={handleClick}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
