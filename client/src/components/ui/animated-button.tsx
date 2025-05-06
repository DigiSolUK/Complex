import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export type EmotionalState = 'calm' | 'positive' | 'urgent' | 'neutral';
export type FeedbackType = 'gentle' | 'strong' | 'none';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonProps {
  emotionalState?: EmotionalState;
  feedbackType?: FeedbackType;
  isLoading?: boolean;
}

/**
 * AnimatedButton - Enhanced button component with emotional states and feedback animations
 * Designed for healthcare interfaces where calm, reassuring interactions are important
 */
const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(({ 
  children, 
  className, 
  variant = 'default',
  size = 'default',
  emotionalState = 'neutral',
  feedbackType = 'gentle',
  isLoading = false,
  disabled,
  ...props 
}, ref) => {
  // Get colors based on emotional state
  const getEmotionalStateStyles = () => {
    switch (emotionalState) {
      case 'calm':
        return 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-50 dark:border-blue-700';
      case 'positive':
        return 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-50 dark:border-green-700';
      case 'urgent':
        return 'bg-red-50 hover:bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-50 dark:border-red-700';
      case 'neutral':
      default:
        return '';
    }
  };
  
  // Button feedback animations
  const getFeedbackAnimation = () => {
    switch (feedbackType) {
      case 'strong':
        return {
          scale: 0.95,
          transition: { duration: 0.1 }
        };
      case 'gentle':
        return {
          scale: 0.98,
          transition: { duration: 0.1 }
        };
      case 'none':
      default:
        return {};
    }
  };
  
  // Hover animations
  const getHoverAnimation = () => {
    switch (feedbackType) {
      case 'strong':
        return {
          scale: 1.05,
          transition: { duration: 0.2 }
        };
      case 'gentle':
        return {
          scale: 1.02,
          transition: { duration: 0.2 }
        };
      case 'none':
      default:
        return {};
    }
  };

  const isDisabled = disabled || isLoading;
  
  return (
    <motion.div
      whileHover={!isDisabled ? getHoverAnimation() : undefined}
      whileTap={!isDisabled ? getFeedbackAnimation() : undefined}
      className="inline-block"
    >
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={isDisabled}
        className={cn(
          emotionalState !== 'neutral' && variant === 'outline' ? getEmotionalStateStyles() : '',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };
