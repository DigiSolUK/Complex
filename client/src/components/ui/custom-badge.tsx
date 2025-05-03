import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge, BadgeProps } from "@/components/ui/badge";

const statusVariants = cva("", {
  variants: {
    variant: {
      default: "bg-primary/10 text-primary hover:bg-primary/20",
      secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20",
      destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      outline: "text-foreground",
      success: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      warning: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type StatusVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

export function StatusBadge({ 
  className, 
  variant, 
  children, 
  ...props 
}: Omit<BadgeProps, "variant"> & { variant?: StatusVariant }) {
  return (
    <Badge 
      className={cn(statusVariants({ variant: variant as any }), className)} 
      {...props} 
    >
      {children}
    </Badge>
  );
}
