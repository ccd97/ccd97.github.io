import { useEffect, useState } from "react";
import { ExternalLink, IdCard, Code2, Hash } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavMenu, type NavItem } from "@/components/portfolio/NavMenu";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SkillCard } from "@/components/portfolio/SkillCard";
import portfolioData from "@/data/portfolio.json";
import type { PortfolioData } from "@/types/portfolio";

const navItems: NavItem[] = [
  { id: "seg_home", label: "Home" },
  { id: "seg_projects", label: "Projects" },
  { id: "seg_skills", label: "Skills" },
  { id: "seg_contact", label: "Contact" },
];

const contactLinks = [
  { label: "GitHub", href: "https://github.com/ccd97", icon: ExternalLink },
  { label: "GitLab", href: "https://gitlab.com/ccd97", icon: ExternalLink },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cyprien-dcunha",
    icon: ExternalLink,
  },
  { label: "Résumé", href: "./resume.html", icon: IdCard },
  {
    label: "CodeChef",
    href: "https://www.codechef.com/users/ccd97",
    icon: Code2,
  },
  {
    label: "HackerRank",
    href: "https://www.hackerrank.com/CCD_1997",
    icon: Hash,
  },
];

const data = portfolioData as PortfolioData;

export function PortfolioPage() {
  const [active, setActive] = useState("seg_home");
  const [showFixedNav, setShowFixedNav] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const masthead = document.getElementById("seg_home");
      if (masthead) {
        setShowFixedNav(masthead.getBoundingClientRect().bottom < 64);
      }
      const scrollPos = window.scrollY + window.innerHeight / 3;
      let current = "seg_home";
      for (const item of navItems) {
        const sec = document.getElementById(item.id);
        if (sec && sec.offsetTop <= scrollPos) current = item.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSelect = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 10, behavior: "smooth" });
    setActive(id);
  };

  return (
    <TooltipProvider>
      {showFixedNav && (
        <NavMenu items={navItems} active={active} fixed onSelect={handleSelect} />
      )}

      <section
        id="seg_home"
        className="min-h-screen flex flex-col items-center justify-center px-4 border-b"
      >
        <NavMenu items={navItems} active={active} onSelect={handleSelect} />
        <div className="max-w-3xl text-center mt-16">
          <h1 className="font-bitter text-6xl md:text-8xl text-brand leading-tight">
            Cyprien Dcunha
          </h1>
          <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 text-lg font-bold">
            <span>Software developer</span>
            <span className="text-muted-foreground">•</span>
            <span>Sport programmer</span>
            <span className="text-muted-foreground">•</span>
            <span>AI programmer</span>
          </div>
        </div>
      </section>

      <section id="seg_projects" className="py-24 px-4 border-b">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>
      </section>

      <section id="seg_skills" className="py-24 px-4 border-b">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.skills.map((skillSet, i) => (
            <SkillCard key={i} skillSet={skillSet} />
          ))}
        </div>
      </section>

      <section
        id="seg_contact"
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      >
        <h2 className="font-bitter text-3xl md:text-5xl">
          <a
            href="mailto:dcunha.cyprien@gmail.com"
            className="text-brand hover:underline"
          >
            dcunha.cyprien@gmail.com
          </a>
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {contactLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          ))}
        </div>
      </section>
    </TooltipProvider>
  );
}
