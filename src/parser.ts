import { readFileSync } from 'fs';
import YAML from 'yaml';
import type { Resume } from './types.js';

/**
 * Parse a YAML file and convert it to a Resume object
 * @param filePath - Path to the YAML file to parse
 * @returns Parsed Resume object
 * @throws Error if the YAML file is invalid or missing required fields
 */
export function parseResumeYAML(filePath: string): Resume {
  const fileContent = readFileSync(filePath, 'utf-8');
  const resume = YAML.parse(fileContent) as Resume;

  // Basic validation
  if (!resume.contact) {
    throw new Error('Contact information is required');
  }

  if (!resume.contact.fullName || !resume.contact.email) {
    throw new Error('Full name and email are required in contact information');
  }

  return resume;
}
