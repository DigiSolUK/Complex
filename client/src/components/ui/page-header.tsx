import React from 'react';

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
}

export function PageHeader({ heading, subheading, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {subheading && (
          <p className="text-muted-foreground">{subheading}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
