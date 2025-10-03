#!/usr/bin/env node

import { Command } from 'commander';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { parseResumeYAML } from './parser.js';
import { generateHTML, exportToPDF } from './generator.js';
import { logger } from './utils/logger.js';
import { createSpinner } from './utils/spinner.js';
import type { Spinner } from './utils/spinner.js';
import type { Resume } from './types.js';

interface GlobalOptions {
  quiet?: boolean;
  verbose?: boolean;
}

interface GenerateOptions {
  output: string;
  template?: string;
}

interface ExportPdfOptions {
  output: string;
  format: string;
  background: boolean;
}

interface BuildOptions extends ExportPdfOptions {
  html: string;
  pdf: string;
  template?: string;
}

const applyGlobalOptions = (): void => {
  const { quiet, verbose } = program.opts<GlobalOptions>();

  if (quiet) {
    logger.setLevel('silent');
  } else if (verbose) {
    logger.setLevel('verbose');
  } else {
    logger.setLevel('info');
  }
};

const handleError = (error: unknown, message: string): never => {
  logger.error(message, error);
  process.exit(1);
};

const loadResume = (inputPath: string): Resume => {
  const spinner: Spinner = createSpinner('Reading YAML file...');
  spinner.start();
  try {
    const resume = parseResumeYAML(inputPath);
    spinner.succeed('YAML parsed successfully');
    return resume;
  } catch (error) {
    spinner.fail('Failed to parse YAML');
    return handleError(error, 'Error reading the resume YAML file.');
  }
};

const renderHtml = (resume: Resume, template?: string): string => {
  const spinner: Spinner = createSpinner('Generating HTML...');
  spinner.start();
  try {
    const html = generateHTML(resume, template ? { templateId: template } : undefined);
    spinner.succeed('HTML generated');
    return html;
  } catch (error) {
    spinner.fail('Failed to generate HTML');
    return handleError(error, 'Error generating the HTML resume.');
  }
};

const program = new Command();

program
  .name('cvault')
  .description('CLI tool for creating resumes from YAML files')
  .version('1.0.0')
  .option('--quiet', 'Suppress non-error output')
  .option('--verbose', 'Enable verbose logging for debugging')
  .showHelpAfterError();

program
  .command('html')
  .description('Generate an HTML resume from a YAML file')
  .argument('<input>', 'Path to the input YAML file')
  .option('-o, --output <file>', 'Path to the output HTML file', 'resume.html')
  .option('-t, --template <template>', 'Template identifier to use')
  .action((input: string, options: GenerateOptions) => {
    applyGlobalOptions();

    const inputPath = resolve(input);
    logger.debug(`Input file resolved to: ${inputPath}`);

    const resume = loadResume(inputPath);
    const html = renderHtml(resume, options.template);

    const outputPath = resolve(options.output);
    try {
      writeFileSync(outputPath, html, 'utf-8');
      logger.success('Resume generated successfully.');
      logger.summary('Outputs', [['HTML', outputPath]]);
    } catch (error) {
      handleError(error, 'Error writing HTML output to disk.');
    }
  });

program
  .command('pdf')
  .description('Export an HTML resume to PDF')
  .argument('<input>', 'Path to the HTML file to convert')
  .option('-o, --output <file>', 'Path to the output PDF file', 'resume.pdf')
  .option('-f, --format <format>', 'Paper format: A4 or Letter', 'A4')
  .option('--no-background', 'Disable printing background colors and images')
  .action(async (input: string, options: ExportPdfOptions) => {
    applyGlobalOptions();

    const inputPath = resolve(input);
    const outputPath = resolve(options.output);
    const format = options.format.toUpperCase() === 'LETTER' ? 'Letter' : 'A4';

    logger.debug(`Input HTML path: ${inputPath}`);
    logger.debug(`PDF output path: ${outputPath}`);
    logger.debug(`PDF format: ${format}`);

    const pdfSpinner: Spinner = createSpinner('Exporting PDF with Puppeteer...');
    pdfSpinner.start();
    try {
      await exportToPDF(inputPath, outputPath, {
        format,
        printBackground: options.background,
      });
      pdfSpinner.succeed('PDF exported');
      logger.success('Resume PDF created successfully.');
      logger.summary('Outputs', [
        ['PDF', outputPath],
        ['Format', format],
        ['Background', options.background ? 'Enabled' : 'Disabled'],
      ]);
    } catch (error) {
      pdfSpinner.fail('Failed to export PDF');
      handleError(error, 'Error exporting the PDF.');
    }
  });

program
  .command('build')
  .description('Generate HTML and export to PDF from a YAML file')
  .argument('<input>', 'Path to the input YAML file')
  .option('-h, --html <file>', 'Path to the output HTML file', 'resume.html')
  .option('-p, --pdf <file>', 'Path to the output PDF file', 'resume.pdf')
  .option('-f, --format <format>', 'Paper format: A4 or Letter', 'A4')
  .option('--no-background', 'Disable printing background colors and images')
  .option('-t, --template <template>', 'Template identifier to use')
  .action(async (input: string, options: BuildOptions) => {
    applyGlobalOptions();

    const inputPath = resolve(input);
    const htmlOutputPath = resolve(options.html);
    const pdfOutputPath = resolve(options.pdf);
    const format = options.format.toUpperCase() === 'LETTER' ? 'Letter' : 'A4';

    logger.debug(`Input YAML path: ${inputPath}`);
    logger.debug(`HTML output path: ${htmlOutputPath}`);
    logger.debug(`PDF output path: ${pdfOutputPath}`);
    logger.debug(`PDF format: ${format}`);

    const resume = loadResume(inputPath);
    const html = renderHtml(resume, options.template);

    try {
      writeFileSync(htmlOutputPath, html, 'utf-8');
      logger.success('HTML written to disk.');
    } catch (error) {
      handleError(error, 'Error writing HTML output to disk.');
    }

    const pdfOptions: {
      format: 'A4' | 'Letter';
      printBackground: boolean;
      pageMargins?: {
        firstPageTop?: number;
        otherPagesTop?: number;
        bottom?: number;
        left?: number;
        right?: number;
      };
    } = {
      format,
      printBackground: options.background,
    };

    if (resume.style?.pageMargins) {
      pdfOptions.pageMargins = resume.style.pageMargins;
      logger.debug('Applied page margins from resume style overrides.');
    }

    const pdfSpinner: Spinner = createSpinner('Exporting PDF...');
    pdfSpinner.start();
    try {
      await exportToPDF(htmlOutputPath, pdfOutputPath, pdfOptions);
      pdfSpinner.succeed('PDF exported');
      logger.success('Resume build completed successfully.');
      logger.summary('Outputs', [
        ['HTML', htmlOutputPath],
        ['PDF', pdfOutputPath],
        ['Format', format],
        ['Background', options.background ? 'Enabled' : 'Disabled'],
      ]);
    } catch (error) {
      pdfSpinner.fail('Failed to export PDF');
      handleError(error, 'Error exporting the PDF.');
    }
  });

program.parseAsync(process.argv).catch(error => {
  handleError(error, 'Unexpected error while running cvault.');
});
