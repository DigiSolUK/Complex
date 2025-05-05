import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, className, actions }: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
