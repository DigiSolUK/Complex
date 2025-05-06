import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type EmotionalState = 'calm' | 'urgent' | 'success' | 'warning';

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, Pick<ButtonProps, 'variant' | 'size'> {
  emotionalState?: EmotionalState;
  animateOnMount?: boolean;
  delay?: number;
  isLoading?: boolean;
}

export function AnimatedButton({
  children,
  className,
  emotionalState = 'calm',
  animateOnMount = true,
  delay = 0,
  isLoading = false,
  ...props
}: AnimatedButtonProps) {
  const getEmotionStyles = () => {
    switch (emotionalState) {
      case 'urgent':
        return 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg';
      case 'calm':
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg';
    }
  };

  const buttonVariants = {
    initial: animateOnMount ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        delay,
        duration: 0.3,
        type: 'spring',
        stiffness: 500,
        damping: 25
      }
    },
    tap: { scale: 0.98 },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="inline-block"
      initial="initial"
      animate="animate"
      whileTap="tap"
      whileHover="hover"
      variants={buttonVariants}
    >
      <Button 
        className={cn(getEmotionStyles(), className)}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : children}
      </Button>
    </motion.div>
  );
}
