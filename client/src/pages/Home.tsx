import { motion } from "framer-motion";
import { ArrowDown, Code2, Database, Layout, Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Section, SectionHeader } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { ContactForm } from "@/components/ContactForm";
import { useProjects } from "@/hooks/use-projects";
import { useSkills } from "@/hooks/use-skills";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export default function Home() {
  const { data: profile } = useQuery({ queryKey: [api.profile.get.path] });
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: experience } = useQuery({ queryKey: [api.experience.list.path] });
  const { data: education } = useQuery({ queryKey: [api.education.list.path] });

  const skillsByCategory = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-xl md:text-2xl font-medium text-accent mb-6">Hello, I'm {profile?.name || "Santosh Mandal"}</h2>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground mb-8">
                {profile?.title || "Software Engineer"}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                {profile?.summary || "Passionate about building impactful web experiences."}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Experience Section */}
        <Section id="experience">
          <SectionHeader title="Experience" subtitle="My professional journey and internships." />
          <div className="space-y-12">
            {experience?.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-8 border-l-2 border-primary/20 hover:border-primary transition-colors pb-8"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary" />
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{exp.position}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-muted-foreground">
                    <p className="font-medium">{exp.duration}</p>
                    <p className="text-sm">{exp.location}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Projects Section */}
        <Section id="projects">
          <SectionHeader
            title="Featured Projects"
            subtitle="Recent work and experimental projects."
          />
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] rounded-2xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects?.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </Section>

        {/* Skills Section */}
        <Section id="skills" className="bg-secondary/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-3xl">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Technical Arsenal" subtitle="Tools and technologies I use to build digital solutions." />
            {skillsLoading ? (
              <div className="h-64 bg-muted/50 animate-pulse rounded-2xl" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {Object.entries(skillsByCategory || {}).map(([category, categorySkills], idx) => (
                  <div key={category} className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span key={skill.id} className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
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

        {/* Education Section */}
        <Section id="education">
          <SectionHeader title="Education" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education?.map((edu) => (
              <div key={edu.id} className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                <p className="text-primary font-medium mb-1">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">{edu.duration}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeader title="Get In Touch" subtitle="Interested in collaborating? Drop me a message!" />
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{profile?.phone}</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{profile?.location}</span>
                </div>
                <div className="flex gap-4 pt-4">
                  {profile?.github && (
                    <a href={`https://${profile.github}`} target="_blank" className="p-2 rounded-full bg-secondary hover:text-primary transition-colors">
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a href={`https://${profile.linkedin}`} target="_blank" className="p-2 rounded-full bg-secondary hover:text-primary transition-colors">
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </Section>
      </div>

      <footer className="py-12 border-t border-border mt-20 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} {profile?.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
