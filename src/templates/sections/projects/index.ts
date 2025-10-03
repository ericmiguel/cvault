import { renderItem } from './item.js';
import type { SectionContext, SectionRenderer } from '../types.js';

export class Projects implements SectionRenderer {
  readonly id = 'projects' as const;
  private readonly fallbackTitle = 'Projects';

  render({ resume, resolveTitle, style }: SectionContext): string {
    if (!resume.projects || resume.projects.length === 0) {
      return '';
    }

    const title = resolveTitle(this.id, this.fallbackTitle);
    const entries = resume.projects
      .map(project =>
        renderItem(project, {
          useIcons: style.useIcons,
          inlineMode: style.inlineProjects,
        })
      )
      .join('\n');

    return `<section class="section-projects">
      ${title ? `<h2>${title}</h2>` : ''}
      ${entries}
    </section>`;
  }
}
