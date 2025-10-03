/**
 * Contact information for the resume header
 */
export interface ContactInfo {
  /** Full name of the person */
  fullName: string;
  /** City and state/region */
  city: string;
  /** Phone number */
  phone: string;
  /** Email address */
  email: string;
  /** LinkedIn profile URL (optional) */
  linkedin?: string;
  /** GitHub profile URL (optional) */
  github?: string;
  /** Personal website URL (optional) */
  website?: string;
}

/**
 * Professional summary section
 */
interface ProfessionalSummary {
  /** Summary text */
  text: string;
}

/**
 * A category of skills with related items
 */
export interface SkillCategory {
  /** Category name (e.g., "Programming Languages", "Frontend") */
  category: string;
  /** List of skills in this category */
  skills: string[];
}

/**
 * Professional experience entry
 */
export interface Experience {
  /** Job position/title */
  position: string;
  /** Company name */
  company: string;
  /** Time period (e.g., "Jan 2022 - Present") */
  period: string;
  /** Narrative paragraph describing the role (optional) */
  description?: string;
  /** List of achievements and responsibilities (optional) */
  achievements?: string[];
}

/**
 * Project entry
 */
export interface Project {
  /** Project name */
  name: string;
  /** Project description */
  description: string;
  /** Technologies used in the project */
  technologies: string[];
  /** Demo/live site URL (optional) */
  link?: string;
  /** Repository URL (optional) */
  repo?: string;
}

/**
 * Education entry
 */
export interface Education {
  /** Degree name */
  degree: string;
  /** Institution name */
  institution: string;
  /** Year or period */
  year: string;
}

/**
 * Certification entry
 */
export interface Certification {
  /** Certification name */
  name: string;
  /** Issuing organization */
  issuer: string;
  /** Year obtained (optional) */
  year?: string;
}

/**
 * Custom titles for resume sections
 */
export interface SectionTitles {
  /** Custom title for summary section (empty string or null to hide) */
  summary?: string;
  /** Custom title for skills section (empty string or null to hide) */
  skills?: string;
  /** Custom title for experience section (empty string or null to hide) */
  experience?: string;
  /** Custom title for projects section (empty string or null to hide) */
  projects?: string;
  /** Custom title for education section (empty string or null to hide) */
  education?: string;
  /** Custom title for certifications section (empty string or null to hide) */
  certifications?: string;
}

/**
 * Badge shape options
 */
type BadgeShape = 'rounded' | 'rectangular';

/**
 * Badge style options
 */
type BadgeStyle = 'filled' | 'outlined' | 'link';

/**
 * Line spacing options for the entire document
 */
type LineSpacing = 'dense' | 'compact' | 'default' | 'spaced';

/** Layout alignment for contact entries */
type ContactLayout = 'left' | 'stack';

/**
 * Page break control options
 */
export interface PageBreakOptions {
  /** Force page break before this section */
  beforeSection?: 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'certifications';
  /** Avoid page break inside experience items */
  avoidBreakInExperience?: boolean;
  /** Avoid page break inside project items */
  avoidBreakInProjects?: boolean;
  /** Avoid page break inside education items */
  avoidBreakInEducation?: boolean;
}

/**
 * PDF page margin options (in pixels)
 */
export interface PageMargins {
  /** Top margin for the first page (default: 0) */
  firstPageTop?: number;
  /** Top margin for all pages except first (default: 40) */
  otherPagesTop?: number;
  /** Bottom margin for all pages (default: 40) */
  bottom?: number;
  /** Left margin (handled by container padding, not @page) */
  left?: number;
  /** Right margin (handled by container padding, not @page) */
  right?: number;
}

/**
 * Styling options for the resume
 */
export interface StyleOptions {
  /** Show border under header (default: true) */
  showHeaderBorder?: boolean;
  /** Show border under section titles (default: true) */
  showTitleBorder?: boolean;
  /** Show side border on cards (default: true) */
  showCardSideBorder?: boolean;
  /** Show SVG icons in header and projects (default: true). When false, no icons are displayed. */
  useIcons?: boolean;
  /** Accent color applied to links, icons, and default badge color */
  accentColor?: string;

  // Font Families
  /** Font family for titles (h1, h2, h3) */
  titleFont?: string;
  /** Font family for body text */
  bodyFont?: string;
  /** Font family for lists */
  listFont?: string;

  // Font Sizing Hierarchy
  /** Base font size for the entire document - all other sizes are relative to this (default: 16px) */
  baseFontSize?: string;
  /** Document title (h1 - person's name) size relative to base (default: 2.5em) */
  documentTitleSize?: string;
  /** Level 1 section titles (h2) size relative to base (default: 1.5em) */
  titleSize?: string;
  /** Level 2 entry titles (h3) size relative to base (default: 1.2em) */
  subTitleSize?: string;
  /** Body text size relative to base (default: 1em) */
  bodyTextSize?: string;

  /** Spacing between sections */
  sectionSpacing?: string;
  /** Spacing between card/list items */
  itemSpacing?: string;
  /** Spacing from h2 (section titles) to content below (default: 15px) */
  titleSpacing?: string;
  /** Spacing from h3 (item subtitles) to content below (default: 4px) */
  subTitleSpacing?: string;
  /** Alignment/layout mode for contact entries */
  contactLayout?: ContactLayout;
  /** Badge shape: rounded or rectangular */
  badgeShape?: BadgeShape;
  /** Badge style: filled, outlined, or link */
  badgeStyle?: BadgeStyle;
  /** Display skill category titles inline with badges (default: false) */
  inlineSkills?: boolean;
  /** Render contact name and details inline within the header (default: false) */
  inlineContactHeader?: boolean;
  /** Render experience position, company, and period inline (default: false) */
  inlineExperience?: boolean;
  /** Render education degree, institution, and year inline (default: false) */
  inlineEducation?: boolean;
  /** Render project name, description, and tech badges inline (default: false) */
  inlineProjects?: boolean;
  /** Number of contact items per line in header (default: unlimited, wraps naturally) */
  contactItemsPerLine?: number;
  /** Line spacing for the entire document: dense, compact, default, or spaced */
  lineSpacing?: LineSpacing;
  /** Page break control for PDF generation */
  pageBreaks?: PageBreakOptions;
  /** PDF page margins control (in pixels) */
  pageMargins?: PageMargins;

  // Deprecated (kept for backwards compatibility)
  /** @deprecated Use baseFontSize instead */
  bodyFontSize?: string;
  /** @deprecated Use titleSize instead */
  sectionTitleSize?: string;
}

/**
 * Complete resume data structure
 */
export interface Resume {
  /** Contact information (required) */
  contact: ContactInfo;
  /** Professional summary (optional) */
  summary?: ProfessionalSummary;
  /** Skills organized by categories (optional) */
  skills?: SkillCategory[];
  /** Professional experience entries (optional) */
  experience?: Experience[];
  /** Project entries (optional) */
  projects?: Project[];
  /** Education entries (optional) */
  education?: Education[];
  /** Certification entries (optional) */
  certifications?: Certification[];
  /** Custom section titles (optional) */
  sectionTitles?: SectionTitles;
  /** Template identifier to select layout and defaults (optional) */
  template?: string;
  /** Styling options (optional) */
  style?: StyleOptions;
}
