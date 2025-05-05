import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div className={cn("text-center p-6", className)}>
      <div className="text-3xl font-bold text-primary mb-2">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
