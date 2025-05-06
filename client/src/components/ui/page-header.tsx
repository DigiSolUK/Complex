import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  heading: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

/**
 * PageHeader - Standardized page heading component
 * Use for consistency in page headers across the application
 */
export function PageHeader({ 
  heading, 
  description, 
  className,
  actions,
}: PageHeaderProps) {
  return (
    <div className={cn(
      'flex flex-col md:flex-row justify-between items-start md:items-center gap-4', 
      className
    )}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
