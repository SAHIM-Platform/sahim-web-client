import { cn } from "@/utils/utils";

type ExcerptProps = {
  content: string;
  wordLimit?: number;
  className?: string;
};

function Excerpt({ content, wordLimit = 100, className }: ExcerptProps) {
  const words = content.trim().split(/\s+/);
  const isTruncated = words.length > wordLimit;
  const excerpt = words.slice(0, wordLimit).join(' ');

  return (
    <p className={cn(
      className,
      'text-xs sm:text-sm text-gray-600 leading-[2] sm:leading-[2] line-clamp-3'
    )}>
      {excerpt}
      {isTruncated && '…'}
    </p>
  );
}

export default Excerpt;