import { renderCategory } from './category.js';
import type { SectionContext, SectionRenderer } from '../types.js';

export class Skills implements SectionRenderer {
  readonly id = 'skills' as const;
  private readonly fallbackTitle = 'Technical Skills';

  render({ resume, resolveTitle, style }: SectionContext): string {
    if (!resume.skills || resume.skills.length === 0) {
      return '';
    }

    const title = resolveTitle(this.id, this.fallbackTitle);
    const categories = resume.skills.map(cat => renderCategory(cat, style.inlineSkills)).join('\n');

    return `<section class="section-skills">
      ${title ? `<h2>${title}</h2>` : ''}
      ${categories}
    </section>`;
  }
}
