import React, { ReactNode } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Enhanced Micro-Interactions
 * 
 * These components provide subtle animations that enhance the user experience
 * by creating a sense of responsiveness and emotional comfort.
 * 
 * Design principles:
 * - Keep animations subtle and quick (under 300ms)
 * - Focus on natural movements
 * - Ensure animations support accessibility (respecting reduced motion settings)
 * - Use consistent animation patterns for predictability
 */

// Base Animation Properties
const baseTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  duration: 0.2
};

// Types
export interface AnimationProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * FadeIn - Subtle fade in animation
 * Use for: Content that appears based on user interaction or page load
 */
export function FadeIn({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ...baseTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideIn - Gentle slide in animation
 * Use for: Components entering from edges, such as alerts or notifications
 */
export function SlideIn({ 
  children, 
  className, 
  delay = 0,
  direction = 'right',
  distance = 20,
  ...props 
}: AnimationProps & { 
  direction?: 'right' | 'left' | 'up' | 'down'; 
  distance?: number;
}) {
  const getInitial = () => {
    switch (direction) {
      case 'right': return { x: distance, opacity: 0 };
      case 'left': return { x: -distance, opacity: 0 };
      case 'up': return { y: -distance, opacity: 0 };
      case 'down': return { y: distance, opacity: 0 };
      default: return { x: distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={getInitial()}
      transition={{ ...baseTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScaleIn - Gentle scale in animation
 * Use for: Emphasizing important elements or action confirmations
 */
export function ScaleIn({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}: AnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ ...baseTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * ContentSwitch - Animate between different content states
 * Use for: Tab contents, different views in the same container
 */
export function ContentSwitch({ 
  children, 
  className, 
  animationType = 'fade',
  ...props 
}: AnimationProps & {
  animationType?: 'fade' | 'slide' | 'scale';
}) {
  const getAnimationProps = () => {
    switch (animationType) {
      case 'slide': return {
        initial: { x: 10, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -10, opacity: 0 },
      };
      case 'scale': return {
        initial: { scale: 0.98, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.98, opacity: 0 },
      };
      default: return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={React.Children.count(children)}
        initial={animationProps.initial}
        animate={animationProps.animate}
        exit={animationProps.exit}
        transition={baseTransition}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * PulseEffect - Subtle pulsing animation
 * Use for: Drawing attention to important elements or new features
 */
export function PulseEffect({ 
  children, 
  className, 
  pulseScale = 1.03, 
  pulseDuration = 1.5,
  ...props 
}: AnimationProps & {
  pulseScale?: number;
  pulseDuration?: number;
}) {
  return (
    <motion.div
      animate={{ 
        scale: [1, pulseScale, 1],
      }}
      transition={{
        duration: pulseDuration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * ComfortIcon - Subtle animations for icons to add personality
 * Use for: Icons related to patient well-being, success messages, or emotional support
 */
export function ComfortIcon({ 
  children, 
  className, 
  animationType = 'pulse',
  delay = 0,
  ...props 
}: AnimationProps & {
  animationType?: 'pulse' | 'wiggle' | 'bounce' | 'none';
}) {
  const getAnimation = () => {
    switch (animationType) {
      case 'wiggle': return {
        animate: { rotate: [0, -5, 5, -5, 0] },
        transition: { duration: 0.5, delay, ease: "easeInOut" }
      };
      case 'bounce': return {
        animate: { y: [0, -3, 0] },
        transition: { duration: 0.5, delay, ease: "easeOut" }
      };
      case 'pulse': return {
        animate: { scale: [1, 1.1, 1] },
        transition: { duration: 0.5, delay, ease: "easeInOut" }
      };
      default: return {
        animate: {},
        transition: {}
      };
    }
  };

  const { animate, transition } = getAnimation();

  return (
    <motion.div
      className={cn("inline-flex", className)}
      initial={{}}
      animate={animate}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * ButtonFeedback - Enhances button interactions with subtle animations
 * Use for: Any interactive buttons to provide tactile feedback
 */
export function ButtonFeedback({ 
  children, 
  className, 
  ...props 
}: AnimationProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ ...baseTransition, duration: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * GentleListItem - Adds staggered animations to list items
 * Use for: Lists where items appear one after another
 */
export function GentleListItem({ 
  children, 
  className, 
  index = 0, 
  staggerDelay = 0.05,
  ...props 
}: AnimationProps & {
  index?: number;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        ...baseTransition, 
        delay: index * staggerDelay,
        staggerChildren: 0.1
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * SuccessFeedback - Animation for successful actions 
 * Use for: Form submissions, completed tasks, or successful operations
 */
export function SuccessFeedback({ 
  children, 
  className, 
  ...props 
}: AnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [0.8, 1.05, 1],
        opacity: 1
      }}
      transition={{ 
        duration: 0.4,
        times: [0, 0.7, 1],
        ease: "easeOut"
      }}
      className={cn("text-success", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * ProgressIndicator - Creates a smooth, calming loading animation
 * Use for: Any loading or processing states
 */
export function ProgressIndicator({ 
  children, 
  className, 
  ...props 
}: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}
    >
      <motion.div
        animate={{ 
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
