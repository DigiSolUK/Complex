import { ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  header?: ReactNode;
  footer?: ReactNode;
  hoverEffect?: 'gentle-lift' | 'gentle-glow' | 'soft-border' | 'none';
  transitionDelay?: number;
  onClick?: () => void;
}

/**
 * AnimatedCard - Enhanced card with subtle micro-interactions
 * 
 * This component adds calm, reassuring animations to card elements
 * to improve the emotional experience of the healthcare interface.
 * 
 * Use for:
 * - Patient records
 * - Medical information display
 * - Treatment options
 * - Statistical information that might cause anxiety
 */
export function AnimatedCard({
  children,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  header,
  footer,
  hoverEffect = 'gentle-lift',
  transitionDelay = 0,
  onClick,
  ...props
}: AnimatedCardProps) {
  // Accessibility check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  
  // Base transitions for all animations
  const baseTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    delay: transitionDelay,
  };
  
  // Define hover animations based on effect type
  const getHoverAnimation = () => {
    if (prefersReducedMotion || hoverEffect === 'none') return {};
    
    switch (hoverEffect) {
      case 'gentle-lift':
        return {
          whileHover: { y: -5, boxShadow: '0 5px 10px rgba(0,0,0,0.1)' },
          transition: baseTransition
        };
      case 'gentle-glow':
        return {
          whileHover: { boxShadow: '0 0 8px rgba(124, 58, 237, 0.6)' },
          transition: baseTransition
        };
      case 'soft-border':
        return {
          whileHover: { borderColor: 'var(--primary)' },
          transition: baseTransition
        };
      default:
        return {};
    }
  };
  
  const hoverAnimation = getHoverAnimation();
  
  // Entry animation - soft fade up
  const entryAnimation = !prefersReducedMotion ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      ...baseTransition,
      delay: transitionDelay
    }
  } : {};
  
  return (
    <motion.div
      className={cn("cursor-default", onClick && "cursor-pointer", className)}
      onClick={onClick}
      {...entryAnimation}
      {...hoverAnimation}
      {...props}
    >
      <Card className="border-[1.5px] h-full transition-colors duration-200">
        {header && (
          <CardHeader className={headerClassName}>
            {header}
          </CardHeader>
        )}
        <CardContent className={cn("pt-6", !header && "pt-6", contentClassName)}>
          {children}
        </CardContent>
        {footer && (
          <CardFooter className={footerClassName}>
            {footer}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
