import { existsSync } from 'fs';
import { resolve } from 'path';
import puppeteer from 'puppeteer';
import type { Resume, SectionTitles, StyleOptions, PageMargins } from './types.js';
import { generateCSS } from './templates/styles/generator.js';
import { defaultSections } from './templates/sections/index.js';
import type { SectionRenderer, SectionWithTitle } from './templates/sections/types.js';

interface GenerateHTMLOptions {
  templateId?: string;
}

interface ExportPdfOptions {
  format?: 'A4' | 'Letter';
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  printBackground?: boolean;
  pageMargins?: PageMargins;
}

interface TemplateDefaults {
  style?: Partial<StyleOptions>;
  sectionTitles?: Partial<SectionTitles>;
}

interface TemplateModule {
  id: string;
  name: string;
  sections: SectionRenderer[];
  defaults?: TemplateDefaults;
}

const defaultTemplate: TemplateModule = {
  id: 'default',
  name: 'Default resume layout',
  sections: defaultSections,
  defaults: {
    sectionTitles: {
      summary: 'Professional Summary',
      skills: 'Technical Skills',
      experience: 'Professional Experience',
      projects: 'Projects',
      education: 'Education',
      certifications: 'Certifications and Courses',
    },
  },
};

function getTemplateById(_id?: string): TemplateModule {
  return defaultTemplate;
}

function mergeStyleOptions(
  resumeStyle?: StyleOptions,
  templateStyle?: Partial<StyleOptions>
): StyleOptions | undefined {
  if (!templateStyle) {
    return resumeStyle;
  }

  const merged: StyleOptions = {
    ...templateStyle,
    ...resumeStyle,
  };

  if (templateStyle.pageBreaks || resumeStyle?.pageBreaks) {
    merged.pageBreaks = {
      ...(templateStyle.pageBreaks ?? {}),
      ...(resumeStyle?.pageBreaks ?? {}),
    };
  }

  if (templateStyle.pageMargins || resumeStyle?.pageMargins) {
    merged.pageMargins = {
      ...(templateStyle.pageMargins ?? {}),
      ...(resumeStyle?.pageMargins ?? {}),
    };
  }

  return merged;
}

/**
 * Get style options with default values applied
 * @param style - Optional style options from resume
 * @returns Complete style options with all defaults filled in
 */
function getStyleDefaults(style?: StyleOptions): Required<StyleOptions> {
  const defaultFont =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  const accentColor = style?.accentColor || '#3498db';

  // Support for backwards compatibility
  const baseFontSize = style?.baseFontSize || style?.bodyFontSize || '16px';
  const titleSize = style?.titleSize || style?.sectionTitleSize || '1.5em';

  return {
    showHeaderBorder: style?.showHeaderBorder !== undefined ? style.showHeaderBorder : true,
    showTitleBorder: style?.showTitleBorder !== undefined ? style.showTitleBorder : true,
    showCardSideBorder: style?.showCardSideBorder !== undefined ? style.showCardSideBorder : true,
    useIcons: style?.useIcons !== undefined ? style.useIcons : true,
    accentColor,
    inlineSkills: style?.inlineSkills !== undefined ? style.inlineSkills : false,
    inlineExperience: style?.inlineExperience !== undefined ? style.inlineExperience : false,
    inlineEducation: style?.inlineEducation !== undefined ? style.inlineEducation : false,
    inlineProjects: style?.inlineProjects !== undefined ? style.inlineProjects : false,
    titleFont: style?.titleFont || defaultFont,
    bodyFont: style?.bodyFont || defaultFont,
    listFont: style?.listFont || defaultFont,
    baseFontSize,
    documentTitleSize: style?.documentTitleSize || '2.5em',
    titleSize,
    subTitleSize: style?.subTitleSize || '1.2em',
    bodyTextSize: style?.bodyTextSize || '1em',
    sectionSpacing: style?.sectionSpacing || '35px',
    itemSpacing: style?.itemSpacing || '25px',
    titleSpacing: style?.titleSpacing || '15px',
    subTitleSpacing: style?.subTitleSpacing || '4px',
    contactLayout: style?.contactLayout || 'left',
    inlineContactHeader: style?.inlineContactHeader ?? false,
    badgeShape: style?.badgeShape || 'rounded',
    badgeStyle: style?.badgeStyle || 'filled',
    contactItemsPerLine: style?.contactItemsPerLine || 0,
    lineSpacing: style?.lineSpacing || 'default',
    pageBreaks: style?.pageBreaks || {},
    pageMargins: style?.pageMargins || {
      firstPageTop: 0,
      otherPagesTop: 40,
      bottom: 40,
      left: 60,
      right: 60,
    },
    // Backwards compatibility
    bodyFontSize: baseFontSize,
    sectionTitleSize: titleSize,
  };
}

function createTitleResolver(
  resume: Resume,
  templateTitles?: Partial<SectionTitles>
): (section: SectionWithTitle, defaultTitle: string) => string {
  return (section: SectionWithTitle, defaultTitle: string) => {
    const key = section as keyof SectionTitles;
    const customTitle = resume.sectionTitles?.[key];
    if (customTitle === null || customTitle === '') {
      return '';
    }
    if (customTitle) {
      return customTitle;
    }

    const templateTitle = templateTitles?.[key];
    if (templateTitle === null || templateTitle === '') {
      return '';
    }
    if (templateTitle) {
      return templateTitle;
    }

    return defaultTitle;
  };
}

function indentHtmlBlock(html: string, indentation = '    '): string {
  return html
    .split('\n')
    .map(line => (line.length > 0 ? `${indentation}${line}` : line))
    .join('\n');
}

/**
 * Generate a complete HTML resume from a Resume object
 * @param resume - Resume object containing all resume data
 * @returns Complete HTML document as a string
 */
export function generateHTML(resume: Resume, options: GenerateHTMLOptions = {}): string {
  const templateId: string | undefined = options.templateId ?? resume.template;
  const template = getTemplateById(templateId);

  const mergedStyle = mergeStyleOptions(resume.style, template.defaults?.style);
  const style = getStyleDefaults(mergedStyle);
  const resolveTitle = createTitleResolver(resume, template.defaults?.sectionTitles);

  const context = {
    resume,
    style,
    resolveTitle,
  };

  const sectionsHtml = template.sections
    .map(section => section.render(context).trim())
    .filter(Boolean)
    .map(sectionHtml => indentHtmlBlock(sectionHtml))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.contact.fullName} - Resume</title>
  <style>${generateCSS(style)}</style>
</head>
<body>
  <div class="container">
${sectionsHtml}
  </div>
</body>
</html>`;
}

export async function exportToPDF(
  htmlPath: string,
  pdfPath: string,
  options?: ExportPdfOptions
): Promise<void> {
  const resolvedHtmlPath = resolve(htmlPath);
  const resolvedPdfPath = resolve(pdfPath);

  if (!existsSync(resolvedHtmlPath)) {
    throw new Error(`HTML file not found: ${resolvedHtmlPath}`);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
      '--disable-font-subpixel-positioning',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.emulateMediaType('screen');
    await page.goto(`file://${resolvedHtmlPath}`, { waitUntil: 'networkidle0' });

    // Add a small delay to allow for rendering and font loading
    await new Promise(resolve => setTimeout(resolve, 300));

    const pageMargins = options?.pageMargins ?? {
      firstPageTop: 0,
      otherPagesTop: 40,
      bottom: 40,
      left: 60,
      right: 60,
    };

    await page.addStyleTag({
      content: `
        @page {
          margin: ${pageMargins.otherPagesTop}px 0px ${pageMargins.bottom}px 0px;
        }
        @page :first {
          margin: ${pageMargins.firstPageTop}px 0px ${pageMargins.bottom}px 0px;
        }
        body {
          padding: 0 !important;
          background: white !important;
        }
        .container {
          box-shadow: none !important;
          padding-left: ${pageMargins.left}px !important;
          padding-right: ${pageMargins.right}px !important;
        }
      `,
    });

    await page.pdf({
      path: resolvedPdfPath,
      format: options?.format ?? 'A4',
      printBackground: options?.printBackground ?? true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
}
