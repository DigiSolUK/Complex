import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { MicroAnimation } from './micro-animation';
import { AlertCircle, CheckCircle, Info, HelpCircle, Heart, ThumbsUp, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComfortMessageProps {
  title?: string;
  description?: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'empathetic' | 'calming' | 'encouraging';
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  autoHide?: boolean;
  hideDelay?: number;
  animate?: boolean;
  onHide?: () => void;
}

export function ComfortMessage({
  title,
  description,
  variant = 'info',
  icon,
  className,
  children,
  autoHide = false,
  hideDelay = 5000,
  animate = true,
  onHide,
}: ComfortMessageProps) {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoHide && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onHide) onHide();
      }, hideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay, visible, onHide]);

  if (!visible) return null;

  // Map variant to alert variant
  const alertVariantMap: Record<string, "default" | "destructive"> = {
    success: 'default',
    warning: 'default',
    error: 'destructive',
    info: 'default',
    empathetic: 'default',
    calming: 'default',
    encouraging: 'default',
  };

  // Map variant to animation variant
  const animationVariantMap: Record<string, "success" | "warning" | "error" | "neutral" | "empathetic" | "calming" | "encouraging"> = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'neutral',
    empathetic: 'empathetic',
    calming: 'calming',
    encouraging: 'encouraging',
  };

  // Default icons based on variant
  const defaultIcon = {
    success: <CheckCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    error: <Frown className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    empathetic: <Heart className="h-5 w-5" />,
    calming: <HelpCircle className="h-5 w-5" />,
    encouraging: <ThumbsUp className="h-5 w-5" />,
  };

  return (
    <Alert 
      variant={alertVariantMap[variant]} 
      className={cn(
        'relative overflow-hidden transition-all duration-300 ease-in-out',
        variant === 'empathetic' && 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-200',
        variant === 'calming' && 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-600 dark:bg-teal-950 dark:text-teal-200',
        variant === 'encouraging' && 'border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-950 dark:text-yellow-200',
        className
      )}
    >
      <MicroAnimation
        variant={animationVariantMap[variant]}
        playOnMount={animate}
        className="mr-3"
      >
        {icon || defaultIcon[variant]}
      </MicroAnimation>
      <div className="space-y-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
        {children}
      </div>
    </Alert>
  );
}
