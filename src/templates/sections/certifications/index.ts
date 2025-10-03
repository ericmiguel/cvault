import { renderEntry } from './entry.js';
import type { SectionContext, SectionRenderer } from '../types.js';

export class Certifications implements SectionRenderer {
  readonly id = 'certifications' as const;
  private readonly fallbackTitle = 'Certifications and Courses';

  render({ resume, resolveTitle }: SectionContext): string {
    if (!resume.certifications || resume.certifications.length === 0) {
      return '';
    }

    const title = resolveTitle(this.id, this.fallbackTitle);
    const entries = resume.certifications.map(renderEntry).join('\n');

    return `<section class="section-certifications">
      ${title ? `<h2>${title}</h2>` : ''}
      ${entries}
    </section>`;
  }
}
