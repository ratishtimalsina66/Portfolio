import { motion } from "framer-motion";
import { ArrowDown, Code2, Database, Layout, Mail, Terminal, Wrench } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Section, SectionHeader } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { ContactForm } from "@/components/ContactForm";
import { useProjects } from "@/hooks/use-projects";
import { useSkills } from "@/hooks/use-skills";

export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: skills, isLoading: skillsLoading } = useSkills();

  // Group skills by category if they exist
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
        {/* Abstract Background Element */}
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
              <h2 className="text-xl md:text-2xl font-medium text-accent mb-6">Hello, I'm a Developer</h2>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground mb-8">
                Building digital <br />
                <span className="text-gradient">experiences</span> that matter.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                Full-stack developer specializing in building exceptional digital products.
                Focused on clean code, user experience, and performance.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
                >
                  View My Work
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
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
        {/* Projects Section */}
        <Section id="projects">
          <SectionHeader
            title="Featured Projects"
            subtitle="A selection of my recent work, featuring full-stack applications and experimental interfaces."
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
            <SectionHeader
              title="Technical Skills"
              subtitle="The tools and technologies I use to bring ideas to life."
            />

            {skillsLoading ? (
              <div className="h-64 bg-muted/50 animate-pulse rounded-2xl" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {Object.entries(skillsByCategory || {}).map(([category, categorySkills], idx) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-background border border-border shadow-sm">
                        {category.toLowerCase().includes('front') ? <Layout className="w-6 h-6 text-primary" /> :
                         category.toLowerCase().includes('back') ? <Database className="w-6 h-6 text-primary" /> :
                         <Wrench className="w-6 h-6 text-primary" />}
                      </div>
                      <h3 className="text-xl font-bold">{category}</h3>
                    </div>

                    <div className="space-y-4">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="group">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                              {skill.name}
                            </span>
                            <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                          </div>
                          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeader
                title="Let's Work Together"
                subtitle="Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you."
              />
              
              <div className="space-y-8 mt-12">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-secondary text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email Me</h4>
                    <p className="text-muted-foreground">hello@example.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-secondary text-primary">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">On the Web</h4>
                    <div className="flex gap-4 text-muted-foreground">
                      <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                      <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                      <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </Section>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Portfolio. Built with React & Tailwind.</p>
        </div>
      </footer>
    </div>
  );
}
