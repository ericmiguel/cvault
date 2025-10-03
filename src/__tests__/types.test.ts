import { describe, it, expect } from 'vitest';
import type { Resume } from '../types.js';

describe('generator utilities', () => {
  it('should validate Resume type structure', () => {
    const validResume: Resume = {
      contact: {
        fullName: 'Test User',
        email: 'test@example.com',
        city: 'Test City',
        phone: '+1-555-0000',
      },
      summary: {
        text: 'A test summary',
      },
      skills: [
        {
          category: 'Languages',
          skills: ['TypeScript', 'JavaScript'],
        },
      ],
    };

    expect(validResume.contact.fullName).toBe('Test User');
    expect(validResume.contact.email).toBe('test@example.com');
    expect(validResume.skills).toHaveLength(1);
    expect(validResume.skills?.[0]?.skills).toContain('TypeScript');
  });

  it('should allow optional fields in Resume', () => {
    const minimalResume: Resume = {
      contact: {
        fullName: 'Test User',
        email: 'test@example.com',
        city: 'Test City',
        phone: '+1-555-0000',
      },
    };

    expect(minimalResume.contact.fullName).toBe('Test User');
    expect(minimalResume.summary).toBeUndefined();
    expect(minimalResume.experience).toBeUndefined();
  });
});
