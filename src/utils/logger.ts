/**
 * Lightweight structured logger.
 *
 * Wraps console with levels and timestamps so test output is greppable in CI.
 * A real project would swap the body for pino/winston without touching callers.
 */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LEVEL_ORDER: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const threshold: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'INFO';

function log(level: LogLevel, message: string, meta?: unknown): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[threshold]) return;
  const ts = new Date().toISOString();
  const suffix = meta !== undefined ? ` ${JSON.stringify(meta)}` : '';
  // eslint-disable-next-line no-console
  console.log(`[${ts}] [${level}] ${message}${suffix}`);
}

export class Logger {
  static debug(message: string, meta?: unknown): void {
    log('DEBUG', message, meta);
  }
  static info(message: string, meta?: unknown): void {
    log('INFO', message, meta);
  }
  static warn(message: string, meta?: unknown): void {
    log('WARN', message, meta);
  }
  static error(message: string, meta?: unknown): void {
    log('ERROR', message, meta);
  }
}
