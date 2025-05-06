import React, { ReactNode } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info, HelpCircle } from 'lucide-react';

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

export type ComfortType = 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'reassurance' | 'empathy' | 'information';

/**
 * ComfortMessage - A visually calming message component for different states
 * Use for: Empty states, success messages, alerts, or guidance
 */
export function ComfortMessage({ 
  icon, 
  title, 
  description, 
  message,
  type = 'neutral',
  action,
  className,
  ...props 
}: {
  icon?: ReactNode;
  title?: string;
  description?: string;
  message?: string; // Allow message as an alternative to title+description
  type?: ComfortType;
  action?: {
    actionLabel: string;
    onClick: () => void;
  };
  className?: string;
}) {
  const getTypeStyles = () => {
    switch (type) {
      case 'info':
      case 'information':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-200';
      case 'reassurance':
        return 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-200';
      case 'empathy':
        return 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950 dark:border-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300';
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'info':
      case 'information':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-blue-50';
      case 'success':
        return 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-800 dark:hover:bg-green-700 dark:text-green-50';
      case 'warning':
        return 'bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-800 dark:hover:bg-amber-700 dark:text-amber-50';
      case 'error':
        return 'bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-800 dark:hover:bg-red-700 dark:text-red-50';
      case 'reassurance':
        return 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:hover:bg-indigo-700 dark:text-indigo-50';
      case 'empathy':
        return 'bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-purple-50';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100';
    }
  };

  // Default icons for different message types
  const getDefaultIcon = () => {
    if (icon) return icon; // Use provided icon if available
    
    switch (type) {
      case 'info':
      case 'information':
        return <Info className="w-12 h-12 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-12 h-12 text-amber-600" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-600" />;
      case 'reassurance':
        return <HelpCircle className="w-12 h-12 text-indigo-600" />;
      case 'empathy':
        return <HelpCircle className="w-12 h-12 text-purple-600" />;
      default:
        return <Info className="w-12 h-12 text-gray-600" />;
    }
  };
  
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center border rounded-lg',
        getTypeStyles(),
        className
      )}
      {...props}
    >
      <ComfortIcon animationType="pulse">
        {getDefaultIcon()}
      </ComfortIcon>
      
      {title && <h3 className="mt-4 text-xl font-medium">{title}</h3>}
      
      {description && <p className="mt-2 max-w-md">{description}</p>}
      
      {/* When using the simplified message format */}
      {message && <p className="mt-2 max-w-md">{message}</p>}
      
      {action && (
        <button 
          onClick={action.onClick}
          className={cn(
            'mt-4 px-4 py-2 rounded font-medium transition-colors',
            getButtonStyles()
          )}
        >
          {action.actionLabel}
        </button>
      )}
    </div>
  );
}
