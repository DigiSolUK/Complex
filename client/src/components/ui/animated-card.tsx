import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type HoverEffect = 'none' | 'gentle-lift' | 'gentle-glow' | 'border-glow' | 'shadow-expand' | 'soft-border';

export interface AnimatedCardProps {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
  hoverEffect?: HoverEffect;
  clickable?: boolean;
  onClick?: () => void;
  transitionDelay?: number;
}

/**
 * AnimatedCard - Enhanced card component with subtle animations
 * Provides a more engaging user experience for cards in the UI
 */
export function AnimatedCard({ 
  children, 
  header,
  className, 
  hoverEffect = 'none',
  clickable = false,
  onClick,
  transitionDelay = 0,
  ...props 
}: AnimatedCardProps) {
  // Define hover animations based on the selected effect
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'gentle-lift':
        return { 
          y: -5, 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: { type: 'spring', stiffness: 400, damping: 17, delay: transitionDelay }
        };
      case 'gentle-glow':
        return { 
          boxShadow: '0 0 15px rgba(52, 152, 219, 0.3)', 
          transition: { duration: 0.3, delay: transitionDelay }
        };
      case 'border-glow':
        return { 
          boxShadow: '0 0 0 2px var(--primary)', 
          transition: { duration: 0.2, delay: transitionDelay }
        };
      case 'shadow-expand':
        return { 
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          transition: { duration: 0.2, delay: transitionDelay }
        };
      case 'soft-border':
        return { 
          boxShadow: '0 0 0 1.5px rgba(100, 100, 255, 0.3)', 
          transition: { duration: 0.2, delay: transitionDelay }
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.3, delay: transitionDelay } 
      }}
      whileHover={hoverEffect !== 'none' ? getHoverAnimation() : undefined}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      onClick={clickable ? onClick : undefined}
      className={cn(
        clickable && 'cursor-pointer',
        'transition-all duration-200'
      )}
    >
      <Card className={className} {...props}>
        {header && (
          <div className="p-6 border-b">
            {header}
          </div>
        )}
        <div className={header ? 'p-6' : ''}>
          {children}
        </div>
      </Card>
    </motion.div>
  );
}
