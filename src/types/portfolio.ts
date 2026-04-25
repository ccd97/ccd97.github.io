export interface Project {
  name?: string;
  repo?: string;
  type?: "github" | "gitlab" | string;
  description: string;
  language: string;
  tools: string[];
  updated_at?: string;
  link?: string;
}

export interface Skill {
  name: string;
  popup?: string;
  weak: boolean;
}

export interface SkillContent {
  heading: string;
  description: string;
  skill_list: Skill[];
}

export interface SkillSet {
  title: string;
  content: SkillContent[];
}

export interface PortfolioData {
  projects: Project[];
  skills: SkillSet[];
}
