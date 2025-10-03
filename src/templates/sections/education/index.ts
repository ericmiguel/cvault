import { renderEntry } from './entry.js';
import type { SectionContext, SectionRenderer } from '../types.js';

export class Education implements SectionRenderer {
  readonly id = 'education' as const;
  private readonly fallbackTitle = 'Education';

  render({ resume, resolveTitle, style }: SectionContext): string {
    if (!resume.education || resume.education.length === 0) {
      return '';
    }

    const title = resolveTitle(this.id, this.fallbackTitle);
    const entries = resume.education.map(edu => renderEntry(edu, style.inlineEducation)).join('\n');

    return `<section class="section-education">
      ${title ? `<h2>${title}</h2>` : ''}
      ${entries}
    </section>`;
  }
}
