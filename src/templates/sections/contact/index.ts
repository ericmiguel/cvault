import { buildDetails, renderDetail } from './detail.js';
import type { SectionContext, SectionRenderer } from '../types.js';

export class Contact implements SectionRenderer {
  readonly id = 'contact' as const;

  render({ resume, style }: SectionContext): string {
    const { contact } = resume;
    const details = buildDetails(contact)
      .map(detail => renderDetail(detail, { useIcons: style.useIcons }))
      .join('\n        ');
    const headerClass = style.inlineContactHeader ? ' class="contact-inline"' : '';

    if (style.inlineContactHeader) {
      return `<header${headerClass}>
      <h1>${contact.fullName}</h1>
      ${details}
    </header>`;
    }

    return `<header${headerClass}>
      <h1>${contact.fullName}</h1>
      <div class="contact-info">
        ${details}
      </div>
    </header>`;
  }
}
