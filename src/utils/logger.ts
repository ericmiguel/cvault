import boxen from 'boxen';
import chalk from 'chalk';
import { inspect } from 'util';

type LogLevel = 'silent' | 'info' | 'verbose';

const icons = {
  info: chalk.cyan('ℹ'),
  success: chalk.green('✔'),
  warn: chalk.yellow('⚠'),
  error: chalk.red('✖'),
};

class Logger {
  private level: LogLevel = 'info';

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  isSilent(): boolean {
    return this.level === 'silent';
  }

  info(message: string): void {
    if (this.isSilent()) return;
    console.log(`${icons.info} ${message}`);
  }

  success(message: string): void {
    if (this.isSilent()) return;
    console.log(`${icons.success} ${message}`);
  }

  warn(message: string): void {
    if (this.isSilent()) return;
    console.warn(`${icons.warn} ${message}`);
  }

  debug(message: string): void {
    if (this.level !== 'verbose') return;
    console.log(`${chalk.gray('…')} ${chalk.dim(message)}`);
  }

  error(message: string, detail?: unknown): void {
    console.error(`${icons.error} ${chalk.red(message)}`);
    if (!detail) return;

    if (detail instanceof Error) {
      if (this.level === 'verbose' && detail.stack) {
        console.error(chalk.gray(detail.stack));
      } else if (detail.message) {
        console.error(chalk.gray(detail.message));
      }
    } else {
      const rendered =
        typeof detail === 'string' ? detail : inspect(detail, { depth: 2, colors: true });
      console.error(chalk.gray(rendered));
    }
  }

  summary(title: string, rows: Array<[label: string, value: string]>): void {
    if (this.isSilent()) return;

    const labelWidth = rows.reduce((max, [label]) => Math.max(max, label.length), 0);
    const body = rows
      .map(([label, value]) => `${chalk.gray(label.padEnd(labelWidth))}  ${value}`)
      .join('\n');

    const content = `${chalk.bold(title)}\n${body}`;

    console.log(
      boxen(content, {
        padding: 1,
        borderColor: 'green',
        dimBorder: true,
        align: 'left',
      })
    );
  }
}

export const logger = new Logger();
