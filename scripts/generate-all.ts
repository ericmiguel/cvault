import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

interface CliOptions {
  readonly pdfOnly: boolean;
  readonly htmlOnly: boolean;
}

const COLORS = {
  green: '\u001b[0;32m',
  blue: '\u001b[0;34m',
  yellow: '\u001b[1;33m',
  red: '\u001b[0;31m',
  reset: '\u001b[0m',
};

const TEMPLATES_DIR = path.resolve('static', 'templates');
const OUTPUT_DIR = path.resolve('static', 'rendered');

function parseOptions(argv: readonly string[]): CliOptions {
  let pdfOnly = false;
  let htmlOnly = false;

  for (const arg of argv) {
    if (arg === '--pdf-only') {
      pdfOnly = true;
    } else if (arg === '--html-only') {
      htmlOnly = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (pdfOnly && htmlOnly) {
    throw new Error('Options --pdf-only and --html-only cannot be used together.');
  }

  return { pdfOnly, htmlOnly };
}

async function ensureOutputDir(): Promise<void> {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

async function listYamlTemplates(): Promise<string[]> {
  const entries = await fs.readdir(TEMPLATES_DIR, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.yaml'))
    .map(entry => entry.name)
    .sort();
}

async function runBuild(yamlPath: string, htmlPath: string, pdfPath: string): Promise<boolean> {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  return new Promise(resolve => {
    const child = spawn(
      npmCommand,
      ['run', 'dev', '--', 'all', yamlPath, '-h', htmlPath, '-p', pdfPath],
      { stdio: 'ignore' }
    );

    child.on('close', code => {
      resolve(code === 0);
    });
  });
}

async function removeIfExists(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

function logHeader(): void {
  console.log(`${COLORS.blue}========================================${COLORS.reset}`);
  console.log(`${COLORS.blue}  Resume Generator - Batch Processor${COLORS.reset}`);
  console.log(`${COLORS.blue}========================================${COLORS.reset}\n`);
}

async function processTemplate(
  filename: string,
  index: number,
  total: number,
  options: CliOptions
): Promise<boolean> {
  const yamlPath = path.join(TEMPLATES_DIR, filename);
  const baseName = path.parse(filename).name;
  const htmlOutput = path.join(OUTPUT_DIR, `${baseName}.html`);
  const pdfOutput = path.join(OUTPUT_DIR, `${baseName}.pdf`);

  // Force regeneration by deleting existing files
  await removeIfExists(htmlOutput);
  await removeIfExists(pdfOutput);

  console.log(
    `${COLORS.blue}[${index + 1}/${total}]${COLORS.reset} Processing: ${COLORS.yellow}${baseName}${COLORS.reset}`
  );

  const success = await runBuild(yamlPath, htmlOutput, pdfOutput);

  if (!success) {
    console.log(`  ${COLORS.red}✗${COLORS.reset} Failed to generate outputs`);
    return false;
  }

  if (options.pdfOnly) {
    await removeIfExists(htmlOutput);
    console.log(`  ${COLORS.yellow}↺${COLORS.reset} HTML removed (PDF-only mode)`);
    console.log(`  ${COLORS.green}✓${COLORS.reset} PDF:  ${pdfOutput}`);
  } else if (options.htmlOnly) {
    await removeIfExists(pdfOutput);
    console.log(`  ${COLORS.yellow}↺${COLORS.reset} PDF removed (HTML-only mode)`);
    console.log(`  ${COLORS.green}✓${COLORS.reset} HTML: ${htmlOutput}`);
  } else {
    console.log(`  ${COLORS.green}✓${COLORS.reset} HTML: ${htmlOutput}`);
    console.log(`  ${COLORS.green}✓${COLORS.reset} PDF:  ${pdfOutput}`);
  }

  console.log('');
  return true;
}

function logSummary(successCount: number, errorCount: number): void {
  console.log(`${COLORS.blue}========================================${COLORS.reset}`);
  console.log(`${COLORS.blue}  Generation Complete${COLORS.reset}`);
  console.log(`${COLORS.blue}========================================${COLORS.reset}`);
  console.log(`${COLORS.green}✓ Successful:${COLORS.reset} ${successCount}`);
  if (errorCount > 0) {
    console.log(`${COLORS.red}✗ Failed:${COLORS.reset}     ${errorCount}`);
  }
  console.log(`${COLORS.blue}📁 Output directory:${COLORS.reset} ${OUTPUT_DIR}`);
  console.log('');
}

async function main(): Promise<void> {
  let options: CliOptions;

  try {
    options = parseOptions(process.argv.slice(2));
  } catch (error: unknown) {
    console.error(`${COLORS.red}${(error as Error).message}${COLORS.reset}`);
    console.error('Usage: tsx scripts/generate-all.ts [--pdf-only | --html-only]');
    process.exitCode = 1;
    return;
  }

  await ensureOutputDir();
  logHeader();

  const files = await listYamlTemplates();
  console.log(`${COLORS.green}Found ${files.length} YAML templates${COLORS.reset}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const [index, filename] of files.entries()) {
    const result = await processTemplate(filename, index, files.length, options);
    if (result) {
      successCount += 1;
    } else {
      errorCount += 1;
    }
  }

  logSummary(successCount, errorCount);

  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(`${COLORS.red}Unexpected error: ${COLORS.reset}`, error);
  process.exitCode = 1;
});
