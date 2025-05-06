import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AnimatedCardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  delay?: number;
  duration?: number;
  hover?: boolean;
  className?: string;
  cardClassName?: string;
  hoverEffect?: 'gentle-lift' | 'gentle-glow' | 'soft-border' | 'none';
  transitionDelay?: number;
}

export function AnimatedCard({
  children,
  header,
  delay = 0,
  duration = 0.5,
  hover = true,
  className,
  cardClassName,
  hoverEffect = 'gentle-lift',
  transitionDelay = 0
}: AnimatedCardProps) {
  // Define the animation states
  const initialState = { opacity: 0, y: 20 };
  const animateState = { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: delay + transitionDelay,
      duration,
      ease: 'easeOut'
    }
  };
  
  // Define the hover effect based on the selected type
  let hoverStyles = undefined;
  
  if (hover && hoverEffect !== 'none') {
    switch (hoverEffect) {
      case 'gentle-lift':
        hoverStyles = {
          y: -5,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          transition: { duration: 0.2 }
        };
        break;
      case 'gentle-glow':
        hoverStyles = {
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
          transition: { duration: 0.3 }
        };
        break;
      case 'soft-border':
        hoverStyles = {
          outline: '2px solid rgba(59, 130, 246, 0.5)',
          outlineOffset: '2px',
          transition: { duration: 0.2 }
        };
        break;
      default:
        hoverStyles = {
          y: -5,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          transition: { duration: 0.2 }
        };
    }
  }

  return (
    <motion.div
      className={className}
      initial={initialState}
      animate={animateState}
      whileHover={hoverStyles}
    >
      <Card className={cn("h-full", cardClassName)}>
        {header && (
          <div className="p-4 border-b">
            {header}
          </div>
        )}
        <div className={cn("p-4", { "pt-0": !header })}>
          {children}
        </div>
      </Card>
    </motion.div>
  );
}
