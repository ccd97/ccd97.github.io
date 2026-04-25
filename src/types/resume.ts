export interface Contact {
  icon: string;
  text: string;
  url: string;
}

export interface Experience {
  role: string;
  firm: string;
  duration: string;
}

export interface Education {
  degree: string;
  school: string;
  duration: string;
  grade: string;
}

export interface ResumeProject {
  name: string;
  role: string;
  duration: string;
  description: string[];
}

export interface ResumeData {
  contacts: Contact[];
  skills: string[];
  experiences: Experience[];
  education: Education[];
  projects: ResumeProject[];
  achievements: string[];
  seo: string[];
}
