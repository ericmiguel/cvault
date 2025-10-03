import type { Experience } from '../../../types.js';

function renderDetails(experience: Experience): string {
  const parts: string[] = [];

  if (experience.description) {
    parts.push(`<p class="experience-description">${experience.description}</p>`);
  }

  const achievements = experience.achievements ?? [];
  if (achievements.length > 0) {
    parts.push(`<ul>
        ${achievements.map(achievement => `<li>${achievement}</li>`).join('')}
      </ul>`);
  }

  return parts.join('\n');
}

export function renderEntry(experience: Experience, inlineMode: boolean = false): string {
  const details = renderDetails(experience);
  const itemClass = inlineMode ? 'experience-item experience-item-inline' : 'experience-item';

  if (inlineMode) {
    return `<div class="${itemClass}">
    <h3>${experience.position}</h3>
    <span class="separator">|</span>
    <span class="company">${experience.company}</span>
    <span class="separator">|</span>
    <span class="period">${experience.period}</span>
    ${details}
  </div>`;
  }

  return `<div class="${itemClass}">
    <h3>${experience.position}</h3>
    <div class="meta-info">
      <span class="company">${experience.company}</span>
      <span class="separator">|</span>
      <span class="period">${experience.period}</span>
    </div>
    ${details}
  </div>`;
}
