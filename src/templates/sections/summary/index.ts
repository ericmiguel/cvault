import type { SectionContext, SectionRenderer } from '../types.js';

export class Summary implements SectionRenderer {
  readonly id = 'summary' as const;
  private readonly fallbackTitle = 'Professional Summary';

  render({ resume, resolveTitle }: SectionContext): string {
    if (!resume.summary) {
      return '';
    }

    const title = resolveTitle(this.id, this.fallbackTitle);

    return `<section class="section-summary">
      ${title ? `<h2>${title}</h2>` : ''}
      <p class="summary">${resume.summary.text}</p>
    </section>`;
  }
}
