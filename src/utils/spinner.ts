import ora from 'ora';
import type { Ora } from 'ora';
import { logger } from './logger.js';

export interface Spinner {
  start(): void;
  succeed(message: string): void;
  fail(message: string): void;
  stop(): void;
}

export const createSpinner = (text: string): Spinner => {
  const spinner: Ora = ora({ text, isSilent: logger.isSilent() });

  return {
    start: () => {
      spinner.start();
    },
    succeed: (message: string) => {
      spinner.succeed(message);
    },
    fail: (message: string) => {
      spinner.fail(message);
    },
    stop: () => {
      spinner.stop();
    },
  };
};
