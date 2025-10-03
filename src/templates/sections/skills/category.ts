import type { SkillCategory } from '../../../types.js';

export function renderCategory(category: SkillCategory, inlineSkills: boolean): string {
  const categoryClass = inlineSkills ? 'skill-category skill-category-inline' : 'skill-category';

  if (inlineSkills) {
    return `<div class="${categoryClass}">
    <h3>${category.category}</h3>
    ${category.skills.map(skill => `<span class="tech-tag">${skill}</span>`).join('\n    ')}
  </div>`;
  }

  return `<div class="${categoryClass}">
    <h3>${category.category}</h3>
    <div class="skills-list">
      ${category.skills.map(skill => `<span class="tech-tag">${skill}</span>`).join('')}
    </div>
  </div>`;
}
