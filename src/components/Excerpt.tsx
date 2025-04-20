import { cn } from "@/utils/utils";
import MarkdownRenderer from './app/MarkdownRenderer';

type ExcerptProps = {
  content: string;
  className?: string;
};

function Excerpt({ content, className }: ExcerptProps) {
  return (
    <div className={cn(
      className,
      'text-xs sm:text-sm text-gray-600 leading-[2] sm:leading-[2] line-clamp-3'
    )}>
      <MarkdownRenderer content={content} />
    </div>
  );
}

export default Excerpt;