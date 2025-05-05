import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  author: string;
  position: string;
  className?: string;
}

export function TestimonialCard({ quote, author, position, className }: TestimonialCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-lg shadow-sm border", className)}>
      <div className="text-lg font-light italic mb-4">"{quote}"</div>
      <div className="font-medium">{author}</div>
      <div className="text-sm text-gray-500">{position}</div>
    </div>
  );
}
