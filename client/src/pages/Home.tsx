import { motion } from "framer-motion";
import { ArrowDown, Code2, Mail, Phone, MapPin, Github, Linkedin, Briefcase, GraduationCap, FolderGit2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Section, SectionHeader } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { ContactForm } from "@/components/ContactForm";
import { useProjects } from "@/hooks/use-projects";
import { useSkills } from "@/hooks/use-skills";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// --------------------
// Types (match your DB/schema fields used in this file)
// --------------------
type Profile = {
  id: string;
  name: string;
  title: string;
  summary: string;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  github?: string | null;     // can be full url OR github.com/xxx
  linkedin?: string | null;   // can be full url OR linkedin.com/in/xxx
};

type Experience = {
  id: string;
  position: string;
  company: string;
  duration: string;
  location?: string | null;
  description: string;
};

type Education = {
  id: string;
  degree: string;
  institution: string;
  duration: string;
};

// Generic fetch helper (typed)
async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Request failed (${res.status}) for ${path}`);
  return (await res.json()) as T;
}

function normalizeUrl(url?: string | null) {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
}

function SkeletonLine({ w = "w-full" }: { w?: string }) {
  return <div className={`h-4 ${w} rounded bg-muted/60 animate-pulse`} />;
}

export default function Home() {
  // Profile
  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: [api.profile.get.path],
    queryFn: () => fetchJson<Profile>(api.profile.get.path),
  });

  // Projects & Skills hooks
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: skills, isLoading: skillsLoading } = useSkills();

  // Experience
  const { data: experience, isLoading: expLoading } = useQuery<Experience[]>({
    queryKey: [api.experience.list.path],
    queryFn: () => fetchJson<Experience[]>(api.experience.list.path),
  });

  // Education
  const { data: education, isLoading: eduLoading } = useQuery<Education[]>({
    queryKey: [api.education.list.path],
    queryFn: () => fetchJson<Education[]>(api.education.list.path),
  });

  // Skills grouped by category (safe typing)
  const skillsByCategory = skills?.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    (acc[cat] ||= []).push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Nice “role badges” (you can edit these anytime)
  const heroBadges = [
    "Help Desk / IT Support",
    "Hardware Diagnostics",
    "Networking Fundamentals",
    "Web Development (ASP.NET Core)",
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {profileLoading ? (
                <div className="space-y-6">
                  <SkeletonLine w="w-1/3 mx-auto" />
                  <div className="space-y-3">
                    <div className="h-12 md:h-16 rounded bg-muted/60 animate-pulse" />
                    <div className="h-12 md:h-16 rounded bg-muted/60 animate-pulse" />
                  </div>
                  <div className="space-y-2 max-w-2xl mx-auto">
                    <SkeletonLine />
                    <SkeletonLine w="w-5/6 mx-auto" />
                    <SkeletonLine w="w-2/3 mx-auto" />
                  </div>
                </div>
              ) : (
                <>
                  <p className="inline-flex items-center justify-center gap-2 text-sm md:text-base px-4 py-2 rounded-full bg-secondary/60 border border-border/50 text-muted-foreground mb-6">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Available for Help Desk / IT Support roles
                  </p>

                  <h2 className="text-xl md:text-2xl font-medium text-accent mb-4">
                    Hello, I&apos;m <span className="text-foreground font-semibold">{profile?.name}</span>
                  </h2>

                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground mb-6">
                    {profile?.title}
                  </h1>

                  <p className="text-lg md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                    {profile?.summary}
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {heroBadges.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold border border-border/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href="#projects"
                      className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
                    >
                      View My Projects
                    </a>
                    <a
                      href="#contact"
                      className="px-8 py-4 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors w-full sm:w-auto"
                    >
                      Contact Me
                    </a>
                    {/* Optional: put a resume.pdf in client/public/resume.pdf */}
                    <a
                      href="/resume.pdf"
                      className="px-8 py-4 rounded-full border border-border font-semibold hover:bg-secondary transition-colors w-full sm:w-auto"
                    >
                      Download Resume
                    </a>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Experience */}
        <Section id="experience">
          <SectionHeader title="Experience" subtitle="Hands-on IT support and operations work." />
          {expLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-muted/60 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <SkeletonLine w="w-1/2" />
                      <SkeletonLine w="w-1/3" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <SkeletonLine />
                    <SkeletonLine w="w-5/6" />
                    <SkeletonLine w="w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {(experience ?? []).map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold leading-tight">{exp.position}</h3>
                        <p className="text-primary font-medium">{exp.company}</p>
                      </div>
                    </div>
                    <div className="text-right text-muted-foreground">
                      <p className="font-medium">{exp.duration}</p>
                      <p className="text-sm">{exp.location ?? ""}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed max-w-4xl">
                    {exp.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </Section>

        {/* Projects */}
        <Section id="projects">
          <SectionHeader
            title="Projects"
            subtitle="Database-driven apps, systems design, and hands-on builds."
          />
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[380px] rounded-3xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(projects ?? []).map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </Section>

        {/* Skills */}
        <Section
          id="skills"
          className="bg-secondary/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-3xl"
        >
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              title="Technical Skills"
              subtitle="Tools and technologies I use across IT support and development."
            />
            {skillsLoading ? (
              <div className="h-64 bg-muted/50 animate-pulse rounded-2xl" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {Object.entries(skillsByCategory || {}).map(([category, categorySkills]) => (
                  <div key={category} className="space-y-5">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-4 py-2 rounded-xl bg-background border border-border text-sm font-medium hover:border-primary/40 transition-colors"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Education */}
        <Section id="education">
          <SectionHeader title="Education" subtitle="Academic background and coursework." />
          {eduLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="p-6 rounded-3xl bg-muted/50 animate-pulse h-40" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(education ?? []).map((edu) => (
                <div key={edu.id} className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{edu.degree}</h3>
                      <p className="text-primary font-medium">{edu.institution}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{edu.duration}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Contact */}
        <Section id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeader title="Get In Touch" subtitle="Want to connect? Send me a message." />

              <div className="space-y-5 mt-8">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary" />
                  {profile?.email ? (
                    <a className="hover:text-primary transition-colors" href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Email coming soon</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary" />
                  {profile?.phone ? (
                    <a className="hover:text-primary transition-colors" href={`tel:${profile.phone}`}>
                      {profile.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Phone coming soon</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{profile?.location ?? " "}</span>
                </div>

                <div className="flex gap-3 pt-2">
                  {!!profile?.github && (
                    <a
                      href={normalizeUrl(profile.github)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors border border-border/40"
                    >
                      <Github className="w-5 h-5" />
                      <span className="text-sm font-semibold">GitHub</span>
                    </a>
                  )}
                  {!!profile?.linkedin && (
                    <a
                      href={normalizeUrl(profile.linkedin)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors border border-border/40"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="text-sm font-semibold">LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Quick highlights card */}
              <div className="mt-10 p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FolderGit2 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">What I bring</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Strong troubleshooting across Windows, macOS, and Linux</li>
                  <li>• Solid foundations in networking (TCP/IP, DNS, DHCP, VPN)</li>
                  <li>• Hands-on hardware support: builds, diagnostics, peripherals</li>
                  <li>• Web development: HTML/CSS/JS + C# / ASP.NET Core</li>
                </ul>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </Section>
      </div>

      <footer className="py-10 border-t border-border mt-20 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} {profile?.name ?? " "}. All rights reserved.</p>
      </footer>
    </div>
  );
}
