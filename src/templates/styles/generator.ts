import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { StyleOptions, PageBreakOptions } from '../../types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseCSS = readFileSync(join(__dirname, 'base.css'), 'utf-8');

/**
 * Generate page break CSS rules based on options
 */
function generatePageBreakCSS(pageBreaks: PageBreakOptions): string {
  const rules: string[] = [];

  if (pageBreaks.beforeSection) {
    const sectionMap: Record<string, string> = {
      summary: '.section-summary',
      skills: '.section-skills',
      experience: '.section-experience',
      projects: '.section-projects',
      education: '.section-education',
      certifications: '.section-certifications',
    };
    const selector = sectionMap[pageBreaks.beforeSection];
    if (selector) {
      rules.push(`
        ${selector} {
          page-break-before: always;
          break-before: page;
          padding-top: 40px;
        }
      `);
    }
  }

  if (pageBreaks.avoidBreakInExperience) {
    rules.push(`
      .experience-item {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    `);
  }

  if (pageBreaks.avoidBreakInProjects) {
    rules.push(`
      .project-item {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    `);
  }

  if (pageBreaks.avoidBreakInEducation) {
    rules.push(`
      .education-item, .certification-item {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    `);
  }

  return rules.join('\n');
}

/**
 * Generate dynamic CSS rules based on style options
 */
function generateDynamicRules(style: Required<StyleOptions>): string {
  const rules: string[] = [];

  // Header border
  if (style.showHeaderBorder) {
    rules.push(`
      header {
        border-bottom: 3px solid #2c3e50;
      }
    `);
  }

  // Section title border
  if (style.showTitleBorder) {
    rules.push(`
      h2 {
        border-bottom: 2px solid #ecf0f1;
      }
    `);
  }

  // Card side border
  if (style.showCardSideBorder) {
    rules.push(`
      .experience-item, .project-item, .education-item, .certification-item {
        padding-left: 20px;
        border-left: 3px solid #ecf0f1;
      }
    `);
  }

  // Contact layout
  const contactLayout = style.contactLayout;

  if (contactLayout === 'stack') {
    rules.push(`
      .contact-info {
        flex-direction: column;
        align-items: flex-start;
        flex-wrap: nowrap;
      }
      .contact-info span {
        width: 100%;
      }
    `);
  } else {
    rules.push(`
      .contact-info {
        justify-content: flex-start;
        flex-wrap: wrap;
      }
      .contact-info span {
        flex: 0 1 auto;
      }
    `);

    if (!style.inlineContactHeader && style.contactItemsPerLine > 0) {
      rules.push(`
        .contact-info span {
          flex-basis: calc(${100 / style.contactItemsPerLine}% - 15px);
          max-width: calc(${100 / style.contactItemsPerLine}% - 15px);
        }
      `);
    }
  }

  // Badge styles
  const accentColor = style.accentColor;
  const badgeShape = style.badgeShape === 'rounded' ? '6px' : '0';

  let badgeStyles = '';
  switch (style.badgeStyle) {
    case 'filled':
      badgeStyles = `
        background: ${accentColor};
        color: #ffffff;
        border: none;
      `;
      break;
    case 'outlined':
      badgeStyles = `
        background: transparent;
        color: ${accentColor};
        border: 1px solid ${accentColor};
      `;
      break;
    case 'link':
      badgeStyles = `
        background: transparent;
        color: ${accentColor};
        border: none;
        padding: 2px 8px;
        text-decoration: underline;
        text-decoration-style: dotted;
      `;
      break;
  }

  rules.push(`
    .tech-tag {
      border-radius: ${badgeShape};
      ${badgeStyles}
    }
  `);

  return rules.join('\n');
}

/**
 * Generate CSS variables from style options
 */
function generateCSSVariables(style: Required<StyleOptions>): string {
  const lineHeightMap = {
    dense: '1.4',
    compact: '1.5',
    default: '1.6',
    spaced: '1.8',
  };

  return `
    :root {
      --accent-color: ${style.accentColor};
      --title-font: ${style.titleFont};
      --body-font: ${style.bodyFont};
      --list-font: ${style.listFont};
      --base-font-size: ${style.baseFontSize};
      --document-title-size: ${style.documentTitleSize};
      --level1-title-size: ${style.titleSize};
      --level2-title-size: ${style.subTitleSize};
      --body-text-size: ${style.bodyTextSize};
      --section-spacing: ${style.sectionSpacing};
      --item-spacing: ${style.itemSpacing};
      --title-spacing: ${style.titleSpacing};
      --subtitle-spacing: ${style.subTitleSpacing};
      --line-height: ${lineHeightMap[style.lineSpacing]};
    }
  `;
}

/**
 * Generate complete CSS for the resume
 */
export function generateCSS(style: Required<StyleOptions>): string {
  const cssVariables = generateCSSVariables(style);
  const dynamicRules = generateDynamicRules(style);
  const pageBreakCSS = generatePageBreakCSS(style.pageBreaks);

  return `${cssVariables}\n\n${baseCSS}\n\n${dynamicRules}\n\n${pageBreakCSS}`;
}
