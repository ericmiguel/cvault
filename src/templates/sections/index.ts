import { Certifications } from './certifications/index.js';
import { Contact } from './contact/index.js';
import { Education } from './education/index.js';
import { Experience } from './experience/index.js';
import { Projects } from './projects/index.js';
import { Skills } from './skills/index.js';
import { Summary } from './summary/index.js';
import type { SectionRenderer } from './types.js';

const contact = new Contact();
const summary = new Summary();
const skills = new Skills();
const experience = new Experience();
const projects = new Projects();
const education = new Education();
const certifications = new Certifications();

export const defaultSections: SectionRenderer[] = [
  contact,
  summary,
  skills,
  experience,
  projects,
  education,
  certifications,
];

export * from './types.js';
