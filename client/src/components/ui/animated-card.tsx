import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type HoverEffect = 'none' | 'gentle-lift' | 'border-glow' | 'shadow-expand';

export interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: HoverEffect;
  clickable?: boolean;
  onClick?: () => void;
}

/**
 * AnimatedCard - Enhanced card component with subtle animations
 * Provides a more engaging user experience for cards in the UI
 */
export function AnimatedCard({ 
  children, 
  className, 
  hoverEffect = 'none',
  clickable = false,
  onClick,
  ...props 
}: AnimatedCardProps) {
  // Define hover animations based on the selected effect
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'gentle-lift':
        return { 
          y: -5, 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: { type: 'spring', stiffness: 400, damping: 17 }
        };
      case 'border-glow':
        return { 
          boxShadow: '0 0 0 2px var(--primary)', 
          transition: { duration: 0.2 }
        };
      case 'shadow-expand':
        return { 
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          transition: { duration: 0.2 }
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      whileHover={hoverEffect !== 'none' ? getHoverAnimation() : undefined}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      onClick={clickable ? onClick : undefined}
      className={cn(
        clickable && 'cursor-pointer',
        'transition-all duration-200'
      )}
    >
      <Card className={className} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}
