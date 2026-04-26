import { useEffect, useState } from "react";
import { Github, Gitlab, Linkedin, IdCard, ExternalLink } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CarouselControls } from "@/components/portfolio/CarouselControls";
import { NavMenu, type NavItem } from "@/components/portfolio/NavMenu";
import { Hero } from "@/components/portfolio/Hero";
import { ExperienceTimeline } from "@/components/portfolio/ExperienceTimeline";
import { CaseStudyCard } from "@/components/portfolio/CaseStudyCard";
import { CaseStudyDialog } from "@/components/portfolio/CaseStudyDialog";
import { SideProjectCard } from "@/components/portfolio/SideProjectCard";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import portfolioData from "@/data/portfolio.json";
import type { CaseStudy, PortfolioData } from "@/types/portfolio";

const navItems: NavItem[] = [
  { id: "seg_home", label: "Home" },
  { id: "seg_work", label: "Work" },
  { id: "seg_side", label: "Projects" },
  { id: "seg_skills", label: "Skills" },
  { id: "seg_contact", label: "Contact" },
];

const iconMap: Record<string, typeof Github> = {
  github: Github,
  gitlab: Gitlab,
  linkedin: Linkedin,
  idcard: IdCard,
};

const data = portfolioData as PortfolioData;

function SectionHeader({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker?: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {index} / {title}
      </p>
      <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-foreground">
        {kicker ?? title}
      </h2>
    </div>
  );
}

export function PortfolioPage() {
  const [active, setActive] = useState("seg_home");
  const [scrolled, setScrolled] = useState(false);
  const [openCaseStudy, setOpenCaseStudy] = useState<CaseStudy | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(
    data.work.roles[0]?.id ?? null,
  );
  const [workApi, setWorkApi] = useState<CarouselApi>();
  const [sideApi, setSideApi] = useState<CarouselApi>();

  const visibleCaseStudies = selectedRoleId
    ? data.work.caseStudies.filter((c) => c.roleIds.includes(selectedRoleId))
    : [];

  const selectedRole = selectedRoleId
    ? (data.work.roles.find((r) => r.id === selectedRoleId) ?? null)
    : null;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
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
    window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
    setActive(id);
  };

  return (
    <>
      <NavMenu
        name={data.hero.name}
        items={navItems}
        active={active}
        scrolled={scrolled}
        onSelect={handleSelect}
      />

      <Hero hero={data.hero} email={data.contact.email} />

      <section id="seg_work" className="py-24 md:py-32 px-4 sm:px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            index="02"
            title="Work"
            kicker={selectedRole ? selectedRole.role : data.work.defaultKicker}
          />

          <div className="mb-16">
            <ExperienceTimeline
              roles={data.work.roles}
              selectedId={selectedRoleId}
              onSelect={setSelectedRoleId}
            />
          </div>

          <div className="flex items-center justify-between gap-4 mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {selectedRole
                ? `${visibleCaseStudies.length} Notable Project${visibleCaseStudies.length === 1 ? "" : "s"} at ${selectedRole.company}${selectedRole.org ? ` · ${selectedRole.org}` : ""}`
                : ""}
            </p>
          </div>

          {visibleCaseStudies.length > 0 ? (
            <>
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visibleCaseStudies.map((cs) => (
                  <CaseStudyCard
                    key={cs.id}
                    caseStudy={cs}
                    onOpen={(c) => setOpenCaseStudy(c)}
                  />
                ))}
              </div>
              <Carousel
                setApi={setWorkApi}
                opts={{ align: "start" }}
                className="md:hidden"
                aria-label="Case studies"
              >
                <CarouselContent>
                  {visibleCaseStudies.map((cs) => (
                    <CarouselItem key={cs.id}>
                      <CaseStudyCard
                        caseStudy={cs}
                        onOpen={(c) => setOpenCaseStudy(c)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselControls api={workApi} label="Case studies" />
              </Carousel>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card/30 px-6 py-12 text-center text-muted-foreground">
              No case studies recorded for this role yet.
            </div>
          )}
        </div>
      </section>

      <section id="seg_side" className="py-24 md:py-32 px-4 sm:px-6 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            index="03"
            title="Projects"
            kicker={data.sideProjects.kicker}
          />
          <p className="-mt-8 mb-12 max-w-2xl text-muted-foreground">
            {data.sideProjects.intro}
          </p>
          <div className="hidden md:grid grid-cols-2 gap-5">
            {data.sideProjects.items.map((p) => (
              <SideProjectCard key={p.repo ?? p.name} project={p} />
            ))}
          </div>
          <Carousel
            setApi={setSideApi}
            opts={{ align: "start" }}
            className="md:hidden"
            aria-label="Side projects"
          >
            <CarouselContent>
              {data.sideProjects.items.map((p) => (
                <CarouselItem key={p.repo ?? p.name}>
                  <SideProjectCard project={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselControls api={sideApi} label="Side projects" />
          </Carousel>
        </div>
      </section>

      <section id="seg_skills" className="py-24 md:py-32 px-4 sm:px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader index="04" title="Skills" kicker="Stack" />
          <SkillsSection groups={data.skills.groups} />
        </div>
      </section>

      <section
        id="seg_contact"
        className="py-24 md:py-32 px-4 sm:px-6 border-t border-border bg-muted/30"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            05 / Contact
          </p>
          <h2 className="mt-6 font-display text-3xl md:text-5xl leading-tight">
            <a
              href={`mailto:${data.contact.email}`}
              className="text-brand hover:underline underline-offset-4"
            >
              {data.contact.email}
            </a>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {data.contact.links.map((link) => {
              const Icon = iconMap[link.icon] ?? ExternalLink;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <CaseStudyDialog
        caseStudy={openCaseStudy}
        open={openCaseStudy !== null}
        onOpenChange={(open) => {
          if (!open) setOpenCaseStudy(null);
        }}
      />
    </>
  );
}
