import { icons } from '../../icons.js';
import type { Project } from '../../../types.js';

export function renderItem(
  project: Project,
  opts: { useIcons: boolean; inlineMode: boolean }
): string {
  const linkIcon = opts.useIcons ? icons.link : '';
  const repoIcon = opts.useIcons ? icons.github : '';

  const links: string[] = [];
  if (project.link) {
    links.push(`<a href="${project.link}" target="_blank">${linkIcon}Demo</a>`);
  }
  if (project.repo) {
    links.push(`<a href="${project.repo}" target="_blank">${repoIcon}Repository</a>`);
  }

  const linkItems = links.map(link => `<span class="project-link-item">${link}</span>`);
  const linksMarkup = linkItems.length
    ? `<span class="project-links">${linkItems.join('<span class="project-link-separator">|</span>')}</span>`
    : '';

  const itemClass = opts.inlineMode ? 'project-item project-item-inline' : 'project-item';

  if (opts.inlineMode) {
    return `<div class="${itemClass}">
    <div class="project-header-inline">
      <h3>${project.name}</h3>
      ${linksMarkup ? `<span class="separator">–</span>${linksMarkup}` : ''}
    </div>
    <div class="project-content-inline">
      <span class="project-description-inline">${project.description}</span>
      ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
    </div>
  </div>`;
  }

  return `<div class="${itemClass}">
    <div class="project-heading">
      <h3>${project.name}</h3>
      ${linksMarkup}
    </div>
    <p>${project.description}</p>
    <div class="technologies">
      ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
    </div>
  </div>`;
}
