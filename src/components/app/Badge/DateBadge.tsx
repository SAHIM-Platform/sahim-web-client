import { Clock } from "lucide-react";

interface DateBadgeProps {
  label: string;
}

function DateBadge({ label }: DateBadgeProps) {
  return (
    <span className="flex items-center gap-1 text-gray-700">
      <Clock className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

export default DateBadge;