export interface Hero {
  name: string;
  tagline: string;
  currently: string;
  location: string;
}

export interface Role {
  id: string;
  company: string;
  org: string | null;
  role: string;
  start: string;
  end: string | null;
  location: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  org: string;
  role: string;
  duration: string;
  summary: string;
  metrics: Metric[];
  tech: string[];
  problem: string;
  approach: string[];
  outcome: string[];
  roleIds: string[];
}

export interface Work {
  defaultKicker: string;
  roles: Role[];
  caseStudies: CaseStudy[];
}

export interface SideProject {
  name: string;
  repo?: string;
  type?: "github" | "gitlab";
  description: string;
  tools: string[];
  link?: string;
}

export interface SideProjects {
  kicker: string;
  intro: string;
  items: SideProject[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Skills {
  groups: SkillGroup[];
}

export type ContactIcon = "github" | "gitlab" | "linkedin" | "idcard";

export interface ContactLink {
  label: string;
  href: string;
  icon: ContactIcon;
}

export interface Contact {
  email: string;
  links: ContactLink[];
}

export interface PortfolioData {
  hero: Hero;
  work: Work;
  sideProjects: SideProjects;
  skills: Skills;
  contact: Contact;
}
