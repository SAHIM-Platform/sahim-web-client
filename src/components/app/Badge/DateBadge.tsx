import { cn } from "@/utils/utils";
import { Clock } from "lucide-react";

interface DateBadgeProps {
  label: string;
  size?: 'default' | 'sm';
}

function DateBadge({ label, size = 'default' }: DateBadgeProps) {
  return (
    <span className={cn(
      'flex items-center gap-1 text-gray-500',
      size === 'sm' && 'text-xs',
    )}>
      <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3 h-3'} />
      {label}
    </span>
  )
}

export default DateBadge;