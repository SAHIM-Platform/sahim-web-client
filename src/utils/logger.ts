/**
 * A utility for consistent application logging with different log levels.
 * 
 * @returns A logger instance with methods for different log levels
 * @example
 * // Import the logger
 * import { logger } from '@/util/logger';
 * 
 * // Create a logger instance
 * const log = logger();
 * 
 * // Use different log levels
 * log.debug('Debugging information', { data: 'value' });
 * log.info('General information');
 * log.warn('Warning message');
 * log.error('Error occurred', new Error('Something went wrong'));
 */

type LogArg = string | number | boolean | null | undefined | Error | Record<string, unknown> | unknown;

export function logger(): LoggerType {
  return {
    debug: (message: string, ...args: LogArg[]) => {
      if (isLoggingEnabled()) {
        console.debug(`🐛 DEBUG: ${message}`, ...args);
      }
    },
    info: (message: string, ...args: LogArg[]) => {
      if (isLoggingEnabled()) {
        console.info(`ℹ️ INFO: ${message}`, ...args);
      }
    },
    warn: (message: string, ...args: LogArg[]) => {
      if (isLoggingEnabled()) {
        console.warn(`⚠️ WARN: ${message}`, ...args);
      }
    },
    error: (message: string, ...args: LogArg[]) => {
      if (isLoggingEnabled()) {
        console.error(`❌ ERROR: ${message}`, ...args);
      }
    },
  };
}

/**
 * Checks if logging is enabled based on environment variables
 * 
 * @returns Boolean indicating if logging is enabled
 */
export function isLoggingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true' || process.env.NODE_ENV === 'development';
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerType {
  debug: (message: string, ...args: LogArg[]) => void;
  info: (message: string, ...args: LogArg[]) => void;
  warn: (message: string, ...args: LogArg[]) => void;
  error: (message: string, ...args: LogArg[]) => void;
}
