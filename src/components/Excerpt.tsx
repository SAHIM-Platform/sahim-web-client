import { cn } from "@/utils/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ExcerptProps = {
  content: string;
  wordLimit?: number;
  className?: string;
};

function Excerpt({ content, className }: ExcerptProps) {
  return (
    <div  className={cn(
      className,
      'text-xs sm:text-sm text-gray-600 leading-[2] sm:leading-[2] line-clamp-3'
    )}>
    <ReactMarkdown 
    remarkPlugins={[remarkGfm]}
    components={{
      a: ({ href, children }) => (
        <a
          href={href}
          className='text-blue-400 hover:text-blue-300 underline'
          target='_blank'
          rel='noopener noreferrer'
        >
          {children}
        </a>
      ),
      h1: ({ children }) => (
        <p className='text-2xl font-bold mb-4'>{children}</p>
      ),
      h2: ({ children }) => (
        <p className='text-xl font-bold mb-4 mt-4'>{children}</p>
      ),
      h3: ({ children }) => (
        <p className='text-lg font-semibold mb-2 mt-2'>{children}</p>
      ),
      ul: ({ children }) => (
        <ul className='list-disc pl-2 mb-4 space-y-1'>{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className='list-decimal pl-6 mb-4 space-y-1'>{children}</ol>
      ),
      p: ({ children }) => (
        <p className='leading-8 mb-2 font-light'>{children}</p>
      ),
      li: ({ children }) => (
        <li className='leading-7 pl-2 marker:text-gray-400 [&>strong]:mt-0 [&>strong]:inline'>{children}</li>
      ),
      strong: ({ children }) => (
        <strong className='font-semibold '>{children}</strong>
      ),
      code: ({ children }) => (
        <div className="bg-gray-100 text-xs p-2 rounded-lg font-semibold" dir="ltr">
        <code>{children}</code>
        </div>
      ),
    }}
    >
      {content}
    </ReactMarkdown>
  </div>
  );
}

export default Excerpt;