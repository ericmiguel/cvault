import { describe, it, expect } from 'vitest';
import { parseResumeYAML } from '../parser.js';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

describe('parseResumeYAML', () => {
  const testFile = join(process.cwd(), 'test-resume.yaml');

  it('should parse a valid YAML resume file', () => {
    const validYaml = `
contact:
  fullName: John Doe
  email: john.doe@example.com
  city: San Francisco, CA
  phone: "+1-555-123-4567"
  linkedin: linkedin.com/in/johndoe
  github: github.com/johndoe

summary:
  text: Software engineer with 5 years of experience.

skills:
  - category: Programming Languages
    skills:
      - TypeScript
      - Python

experience:
  - position: Senior Developer
    company: Tech Corp
    period: Jan 2020 - Present
    highlights:
      - Built scalable applications
      - Led team of 5 developers
`;

    writeFileSync(testFile, validYaml);

    try {
      const resume = parseResumeYAML(testFile);

      expect(resume.contact.fullName).toBe('John Doe');
      expect(resume.contact.email).toBe('john.doe@example.com');
      expect(resume.contact.city).toBe('San Francisco, CA');
      expect(resume.summary?.text).toBe('Software engineer with 5 years of experience.');
      expect(resume.skills).toHaveLength(1);
      expect(resume.experience).toHaveLength(1);
    } finally {
      unlinkSync(testFile);
    }
  });

  it('should throw error when contact information is missing', () => {
    const invalidYaml = `
summary:
  text: Some text
`;

    writeFileSync(testFile, invalidYaml);

    try {
      expect(() => parseResumeYAML(testFile)).toThrow('Contact information is required');
    } finally {
      unlinkSync(testFile);
    }
  });

  it('should throw error when full name is missing', () => {
    const invalidYaml = `
contact:
  email: john@example.com
`;

    writeFileSync(testFile, invalidYaml);

    try {
      expect(() => parseResumeYAML(testFile)).toThrow('Full name and email are required');
    } finally {
      unlinkSync(testFile);
    }
  });

  it('should throw error when email is missing', () => {
    const invalidYaml = `
contact:
  fullName: John Doe
`;

    writeFileSync(testFile, invalidYaml);

    try {
      expect(() => parseResumeYAML(testFile)).toThrow('Full name and email are required');
    } finally {
      unlinkSync(testFile);
    }
  });
});
