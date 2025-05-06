import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ButtonFeedback } from '@/components/ui/animations';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  emotionalState?: 'calm' | 'positive' | 'urgent' | 'neutral';
  feedbackType?: 'gentle' | 'strong' | 'none';
}

/**
 * AnimatedButton - An enhanced button component with micro-interactions
 * 
 * This button provides subtle animations based on emotional states to create
 * a more comforting and responsive user experience.
 * 
 * emotionalState:
 * - calm: Soothing, gentle interactions for everyday tasks
 * - positive: Uplifting feedback for successful actions or good news
 * - urgent: More attention-grabbing for important actions without causing anxiety
 * - neutral: Standard feedback with minimal emotional cues
 * 
 * feedbackType:
 * - gentle: Subtle animations suitable for most contexts
 * - strong: More noticeable animations for important actions
 * - none: No animations, for when accessibility or user preference requires it
 */
export function AnimatedButton({
  children,
  className,
  emotionalState = 'neutral',
  feedbackType = 'gentle',
  variant = 'default',
  size = 'default',
  ...props
}: AnimatedButtonProps) {
  // Skip animation if user prefers reduced motion or feedback is set to none
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  
  const shouldAnimate = feedbackType !== 'none' && !prefersReducedMotion;
  
  // Determine the hover scale based on feedbackType
  const hoverScale = feedbackType === 'gentle' ? 1.02 : feedbackType === 'strong' ? 1.04 : 1;
  const tapScale = feedbackType === 'gentle' ? 0.98 : feedbackType === 'strong' ? 0.96 : 1;
  
  // Adjust variant based on emotional state if using default variant
  // Type-safe variant initialization
  let adjustedVariant: typeof variant = variant;
  
  // Only adjust if using default variant and emotional state is not neutral
  if (variant === 'default' && emotionalState !== 'neutral') {
    // Map emotional states to appropriate button variants
    const emotionalVariantMap: Record<string, typeof variant> = {
      'calm': 'secondary',
      'positive': 'secondary', // Using secondary for positive emotion
      'urgent': 'destructive',
      'neutral': 'default'
    };
    
    // Get the mapped variant or fallback to default
    adjustedVariant = emotionalVariantMap[emotionalState] || 'default';
  }
  
  // Define emotional state classes - subtle color adjustments
  const emotionalClasses = {
    calm: 'shadow-sm hover:shadow-md transition-shadow',
    positive: 'shadow-sm hover:shadow-md transition-shadow',
    urgent: 'shadow-md transition-shadow',
    neutral: ''
  };
  
  // If animations are disabled, render a regular button
  if (!shouldAnimate) {
    return (
      <Button
        className={cn(emotionalClasses[emotionalState], className)}
        variant={adjustedVariant as any}
        size={size}
        {...props}
      >
        {children}
      </Button>
    );
  }
  
  return (
    <ButtonFeedback 
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      className={cn("inline-block", className)}
    >
      <Button
        className={cn(emotionalClasses[emotionalState])}
        variant={adjustedVariant as any}
        size={size}
        {...props}
      >
        {children}
      </Button>
    </ButtonFeedback>
  );
}
