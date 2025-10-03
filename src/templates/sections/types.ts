import type { Resume, StyleOptions } from '../../types.js';

export type SectionWithTitle =
  | 'summary'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications';

type SectionId = 'contact' | SectionWithTitle;

export interface SectionContext {
  resume: Resume;
  style: Required<StyleOptions>;
  resolveTitle: (section: SectionWithTitle, defaultTitle: string) => string;
}

export interface SectionRenderer {
  readonly id: SectionId;
  render(context: SectionContext): string;
}
