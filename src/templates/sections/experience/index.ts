import { renderEntry } from './entry.js';
import type { SectionContext, SectionRenderer } from '../types.js';

export class Experience implements SectionRenderer {
  readonly id = 'experience' as const;
  private readonly fallbackTitle = 'Professional Experience';

  render({ resume, resolveTitle, style }: SectionContext): string {
    if (!resume.experience || resume.experience.length === 0) {
      return '';
    }

    const title = resolveTitle(this.id, this.fallbackTitle);
    const entries = resume.experience
      .map(exp => renderEntry(exp, style.inlineExperience))
      .join('\n');

    return `<section class="section-experience">
      ${title ? `<h2>${title}</h2>` : ''}
      ${entries}
    </section>`;
  }
}
