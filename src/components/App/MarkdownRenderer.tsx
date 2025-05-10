"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils/utils';
import { useCallback, useState } from 'react';
import Image from 'next/image';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface CodeElementProps {
  children: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopyCode = useCallback((code: string, index: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch((err) => console.error('Failed to copy text: ', err));
  }, []);

  const generateUniqueId = useCallback((content: string) => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }, []);

  return (
    <div className={cn(className, 'rtl')}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <p className='text-gray-900 text-xl font-bold mb-8'>{children}</p>
          ),
          h2: ({ children }) => (
            <p className='text-gray-900 text-lg font-bold mb-6 mt-8'>{children}</p>
          ),
          h3: ({ children }) => (
            <p className='text-gray-900 text-md font-semibold mb-5 mt-6'>{children}</p>
          ),
          table: ({ children }) => (
            <div className="text-gray-900 overflow-x-auto my-6 rounded-[15px] border border-gray-400/30">
              <table className="w-full border-collapse text-right">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-300/40 border-b border-gray-400/30">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="text-gray-900 px-6 py-3 text-right font-semibold text-sm">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="text-gray-900 px-6 py-4 border-t border-gray-400/30 text-sm">
              {children}
            </td>
          ),
          ul: ({ children }) => (
            <ul className='text-gray-900 list-disc pr-6 mb-6 space-y-3 text-right'>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className='text-gray-900 list-decimal pr-6 mb-6 space-y-3 text-right'>{children}</ol>
          ),
          li: ({ children }) => (
            <li className='text-gray-900 leading-7 pr-2 marker:text-gray-400 [&>strong]:mt-0 [&>strong]:inline'>{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="text-gray-900 border-gray-700/50 italic my-6 text-right border-r-4 pr-6">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => {
            const codeElement =
              children as React.ReactElement<CodeElementProps>;
            const codeContent = codeElement?.props?.children || '';
            const languageClass = codeElement?.props?.className || '';
            const index = generateUniqueId(codeContent);

            return (
              <div className='relative group my-6' dir='ltr'>
                <pre
                  className={`rounded-lg font-mono bg-[#111] text-gray-200 text-sm border border-[#000] p-5 overflow-x-auto text-left ltr`}
                >
                  <code className={`font-mono text-sm ${languageClass}`}>
                    {codeContent}
                  </code>
                </pre>
                <button
                  type="button"
                  onClick={(e) => handleCopyCode(codeContent, index, e)}
                  className='absolute top-4 right-4 px-2.5 py-1.5 text-xs font-semibold rounded bg-gray-700/50 text-gray-100 opacity-0 border border-gray-500 group-hover:opacity-100 transition-opacity cursor-pointer rtl'
                  dir='rtl'
                >
                  {copiedIndex === index ? 'تم النسخ!' : 'انسخ'}
                </button>
              </div>
            );
          },
          code: ({ children }) => {
            return <code className="text-gray-900 font-mono text-[13px] bg-gray-100/90 px-1.5 py-0.5 rounded border border-gray-400/30">{children}</code>;
          },
          strong: ({ children }) => (
            <strong className='text-gray-900 font-semibold'>{children}</strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className='text-blue-700 hover:text-blue-800 underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              {children}
            </a>
          ),
          p: ({ children }) => (
            <p className="text-gray-900 leading-relaxed mb-4">{children}</p>
          ),
          em: ({ children }) => (
            <em className='text-gray-900 italic'>{children}</em>
          ),
          hr: () => (
            <hr className="my-6 border-gray-200/50" />
          ),
          img: ({ src, alt }) => (
            <div className="my-4">
              {src && <Image 
                src={src}
                alt={alt || ''}
                width={1200}
                height={675}
                className="rounded-lg max-w-full h-auto"
                loading="lazy"
                style={{ objectFit: 'contain' }}
              />}
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 