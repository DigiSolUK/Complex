import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * PatientInfoTransition - A specialized component for transitioning between patient information
 * 
 * Designed specifically to reduce anxiety when displaying medical information by using
 * gentle, reassuring transitions that feel calming rather than clinical.
 * 
 * Use for:
 * - Transitioning between patient records
 * - Showing different medical information sections
 * - Displaying treatment options or medical results
 */
export function PatientInfoTransition({
  isVisible = true,
  id,
  className,
  children,
  transitionType = 'fade',
  duration = 0.4,
  delay = 0,
  staggerChildren = 0.05,
}: {
  isVisible?: boolean;
  id: string | number;
  className?: string;
  children: React.ReactNode;
  transitionType?: 'fade' | 'gentle-slide' | 'soft-zoom';
  duration?: number;
  delay?: number;
  staggerChildren?: number;
}) {
  // Motion variants based on transition type
  const getVariants = () => {
    switch (transitionType) {
      case 'gentle-slide':
        return {
          initial: { opacity: 0, x: 5 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -5 },
        };
      case 'soft-zoom':
        return {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.98 },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const variants = getVariants();

  // Base transition settings
  const transition = {
    duration,
    ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for a gentle, natural feeling
    delay,
  };

  // Child animation variant for staggered children
  const childVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={id}
          className={cn('w-full', className)}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={transition}
        >
          {React.Children.map(children, (child, index) =>
            React.isValidElement(child) ? (
              <motion.div
                variants={childVariants}
                transition={{
                  duration: 0.3,
                  delay: delay + index * staggerChildren,
                }}
              >
                {child}
              </motion.div>
            ) : (
              child
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * PatientInfoItem - Animated item specifically for patient information
 * 
 * A component that applies subtle animations to individual pieces of
 * patient information to make details feel less clinical and more humane.
 */
export function PatientInfoItem({
  label,
  value,
  important = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  important?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={cn('mb-4', className)}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
    >
      <motion.p 
        className="text-sm text-muted-foreground mb-1"
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1 }}
      >
        {label}
      </motion.p>
      <motion.div
        className={cn(
          "text-base",
          important && "font-medium text-primary"
        )}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}
