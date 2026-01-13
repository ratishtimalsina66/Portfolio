import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.skills.list.path, async (req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data if empty
  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    await seedDatabase();
  }

  return httpServer;
}

async function seedDatabase() {
  await storage.createProject({
    title: "E-Commerce Dashboard",
    description: "A comprehensive dashboard for managing online stores, featuring real-time analytics and inventory management.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    projectUrl: "https://example.com",
    repoUrl: "https://github.com",
    tags: ["React", "TypeScript", "D3.js", "Node.js"]
  });

  await storage.createProject({
    title: "Social Media App",
    description: "A real-time social platform with chat, feeds, and multimedia sharing capabilities.",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
    projectUrl: "https://example.com",
    repoUrl: "https://github.com",
    tags: ["Vue.js", "Firebase", "Tailwind"]
  });

  await storage.createProject({
    title: "Task Management Tool",
    description: "Collaborative task management application with kanban boards and team workspaces.",
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800",
    projectUrl: "https://example.com",
    repoUrl: "https://github.com",
    tags: ["React", "Redux", "Express", "PostgreSQL"]
  });

  await storage.createSkill({ name: "React", category: "Frontend", proficiency: 90 });
  await storage.createSkill({ name: "TypeScript", category: "Languages", proficiency: 85 });
  await storage.createSkill({ name: "Node.js", category: "Backend", proficiency: 80 });
  await storage.createSkill({ name: "PostgreSQL", category: "Database", proficiency: 75 });
  await storage.createSkill({ name: "Tailwind CSS", category: "Frontend", proficiency: 95 });
  await storage.createSkill({ name: "Docker", category: "DevOps", proficiency: 60 });
}
