import { icons } from '../../icons.js';
import type { ContactInfo } from '../../../types.js';

type DetailType = 'location' | 'phone' | 'email' | 'linkedin' | 'github' | 'website';

interface Detail {
  type: DetailType;
  label: string;
  href?: string;
}

export function buildDetails(contact: ContactInfo): Detail[] {
  const details: Detail[] = [];

  if (contact.city) {
    details.push({ type: 'location', label: contact.city });
  }

  if (contact.phone) {
    details.push({ type: 'phone', label: contact.phone });
  }

  if (contact.email) {
    details.push({ type: 'email', label: contact.email, href: `mailto:${contact.email}` });
  }

  if (contact.linkedin) {
    details.push({ type: 'linkedin', label: 'LinkedIn', href: contact.linkedin });
  }

  if (contact.github) {
    details.push({ type: 'github', label: 'GitHub', href: contact.github });
  }

  if (contact.website) {
    details.push({ type: 'website', label: 'Website', href: contact.website });
  }

  return details;
}

export function renderDetail(detail: Detail, opts: { useIcons: boolean }): string {
  const icon = opts.useIcons ? getIcon(detail.type) : '';
  const link = detail.href
    ? `<a href="${detail.href}"${detail.href.startsWith('mailto:') ? '' : ' target="_blank"'}>${detail.label}</a>`
    : detail.label;

  return `<span>${icon}${link}</span>`;
}

function getIcon(type: DetailType): string {
  const iconMap: Record<DetailType, string> = {
    location: icons.location,
    phone: icons.phone,
    email: icons.email,
    linkedin: icons.linkedin,
    github: icons.github,
    website: icons.website,
  };

  return iconMap[type] || '';
}
