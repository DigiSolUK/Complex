import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HeartPulse, ShieldCheck, Sparkles, ThumbsUp } from 'lucide-react';

type ComfortType = 'reassurance' | 'empathy' | 'success' | 'information';

interface ComfortMessageProps {
  message: string;
  type?: ComfortType;
  className?: string;
  showIcon?: boolean;
  autoDismiss?: boolean;
  dismissAfter?: number; // milliseconds
  onDismiss?: () => void;
}

/**
 * ComfortMessage - A component for displaying messages with emotional comfort
 * 
 * This component adds subtle animations and emotionally-tuned visual cues
 * to enhance the user experience when displaying medical information.
 * 
 * Use for:
 * - Reassuring patients about medical procedures
 * - Providing empathetic feedback
 * - Confirming successful actions
 * - Delivering sensitive information in a comforting way
 */
export function ComfortMessage({
  message,
  type = 'information',
  className,
  showIcon = true,
  autoDismiss = false,
  dismissAfter = 5000, // 5 seconds default
  onDismiss,
}: ComfortMessageProps) {
  const [visible, setVisible] = useState(true);

  // Auto-dismiss logic
  useEffect(() => {
    if (autoDismiss && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, dismissAfter);
      
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, visible, onDismiss]);

  // Different icons and styles based on comfort type
  const getTypeProperties = () => {
    switch (type) {
      case 'reassurance':
        return {
          icon: <ShieldCheck className="h-5 w-5" />,
          bgColor: 'bg-blue-50 dark:bg-blue-950/30',
          textColor: 'text-blue-700 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-500'
        };
      case 'empathy':
        return {
          icon: <HeartPulse className="h-5 w-5" />,
          bgColor: 'bg-purple-50 dark:bg-purple-950/30',
          textColor: 'text-purple-700 dark:text-purple-300',
          borderColor: 'border-purple-200 dark:border-purple-800',
          iconColor: 'text-purple-500'
        };
      case 'success':
        return {
          icon: <ThumbsUp className="h-5 w-5" />,
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          textColor: 'text-green-700 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800',
          iconColor: 'text-green-500'
        };
      case 'information':
      default:
        return {
          icon: <Sparkles className="h-5 w-5" />,
          bgColor: 'bg-gray-50 dark:bg-gray-900/50',
          textColor: 'text-gray-700 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-800',
          iconColor: 'text-gray-500'
        };
    }
  };

  const { icon, bgColor, textColor, borderColor, iconColor } = getTypeProperties();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      transition: { 
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  // Heartbeat animation for empathy messages
  const heartbeatAnimation = type === 'empathy' ? {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Infinity,
        repeatType: 'reverse' as const,
        duration: 2,
        ease: 'easeInOut'
      }
    }
  } : {};

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn(
            'rounded-lg border p-4 shadow-sm mb-4 relative overflow-hidden',
            bgColor,
            borderColor,
            className
          )}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          {...heartbeatAnimation}
        >
          <div className="flex gap-3">
            {showIcon && (
              <motion.div 
                className={cn('mt-0.5', iconColor)}
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
            <div className={cn('flex-1', textColor)}>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm"
              >
                {message}
              </motion.p>
            </div>
          </div>
          
          {/* Subtle glowing effect for reassurance messages */}
          {type === 'reassurance' && (
            <motion.div 
              className="absolute inset-0 bg-blue-400/5"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'easeInOut'
              }}
            />
          )}
          
          {/* Subtle success animation */}
          {type === 'success' && (
            <motion.div 
              className="absolute top-0 left-0 w-full h-1 bg-green-400/50"
              initial={{ scaleX: 0, transformOrigin: 'left' }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
