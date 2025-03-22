import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that combines clsx and tailwind-merge to conditionally join class names together
 * and properly handle Tailwind CSS class conflicts.
 *
 * @param inputs - Class values to be merged
 * @returns A string of joined class names with Tailwind conflicts resolved
 *
 * @example
 * cn('px-2 py-1', 'px-4', { 'text-red-500': isError })
 * // Returns: 'py-1 px-4 text-red-500' (if isError is true)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
