import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative flex flex-col h-full bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-border transition-all duration-300"
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={project.imageUrl || `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80`} // tech workspace fallback
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="flex flex-col flex-1 p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1 group-hover:translate-y-0">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                title="View Live"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                title="View Code"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full bg-secondary/50 text-secondary-foreground border border-border/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
