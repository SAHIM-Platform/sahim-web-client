import { cn } from "@/utils/utils";
import { Clock } from "lucide-react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ar';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("ar");

export function formatArabicDate(inputDate: string): string {
  const parsedDate = dayjs(inputDate);

  if (!parsedDate.isValid()) {
    return "تاريخ غير صالح";
  }

  const now = dayjs();

  const diffInMonths = now.diff(parsedDate, "month");

  const isFuture = parsedDate.isAfter(now);

  if (isFuture || now.diff(parsedDate, "minute") < 1) {
    return "الان";
  }

  if (diffInMonths >= 12) {
    return parsedDate.format("MMMM YYYY"); // مثال: "يناير 2024"
  }

  return parsedDate.fromNow(); // مثال: "منذ ٥ دقائق"
}

interface DateBadgeProps {
  label: string;
  size?: 'default' | 'sm' | 'xs';
}

function DateBadge({ label, size = 'default' }: DateBadgeProps) {
  const displayTime = formatArabicDate(label);

  return (
    <span className={cn(
      'flex items-center gap-1 text-gray-500',
      size === 'sm' && 'text-xs',
      size === 'xs' && 'text-[10px]',
    )}>
      <Clock className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {displayTime}
    </span>
  );
}

export default DateBadge;