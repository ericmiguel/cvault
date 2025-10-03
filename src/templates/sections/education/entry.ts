import type { Education } from '../../../types.js';

export function renderEntry(education: Education, inlineMode: boolean = false): string {
  const itemClass = inlineMode ? 'education-item education-item-inline' : 'education-item';

  if (inlineMode) {
    return `<div class="${itemClass}">
    <h3>${education.degree}</h3>
    <span class="separator">|</span>
    <span class="institution">${education.institution}</span>
    <span class="separator">|</span>
    <span class="year">${education.year}</span>
  </div>`;
  }

  return `<div class="${itemClass}">
    <h3>${education.degree}</h3>
    <div class="meta-info">
      <span class="institution">${education.institution}</span>
      <span class="separator">|</span>
      <span class="year">${education.year}</span>
    </div>
  </div>`;
}
