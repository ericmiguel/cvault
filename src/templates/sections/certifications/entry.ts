import type { Certification } from '../../../types.js';

export function renderEntry(certification: Certification): string {
  return `<div class="certification-item">
    <h3>${certification.name}</h3>
    <div class="issuer">${certification.issuer}</div>
    ${certification.year ? `<div class="year">${certification.year}</div>` : ''}
  </div>`;
}
