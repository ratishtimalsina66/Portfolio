import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.profile.get.path, async (req, res) => {
    const profile = await storage.getProfile();
    res.json(profile);
  });

  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.skills.list.path, async (req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.get(api.experience.list.path, async (req, res) => {
    const exp = await storage.getExperience();
    res.json(exp);
  });

  app.get(api.education.list.path, async (req, res) => {
    const edu = await storage.getEducation();
    res.json(edu);
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

  // Seed data from the provided resume
  const profile = await storage.getProfile();
  if (!profile) {
    await seedDatabase();
  }

  return httpServer;
}

async function seedDatabase() {
  await storage.createProfile({
    name: "John Doe",
    title: "Full Stack Developer",
    summary: "Professional software developer with experience in building scalable web applications. Passionate about creating clean, efficient code and delivering exceptional user experiences.",
    email: "john.doe@example.com",
    phone: "+1 (555) 000-0000",
    location: "New York, NY",
    github: "github.com/johndoe",
    linkedin: "linkedin.com/in/johndoe"
  });

  await storage.createExperience({
    company: "Global Tech Corp",
    position: "Senior Developer",
    location: "Remote",
    duration: "2020 - Present",
    description: "Developed and maintained core features of the enterprise platform. Led a team of 10 developers to deliver high-quality software."
  });

  await storage.createExperience({
    company: "StartUp Hub",
    position: "Software Engineer",
    location: "San Francisco, CA",
    duration: "2017 - 2020",
    description: "Built responsive user interfaces and robust backend APIs. Contributed to the design of the company's main product."
  });

  await storage.createEducation({
    institution: "Tech University",
    degree: "Bachelor of Computer Science",
    duration: "2013 - 2017"
  });

  const skillSet = [
    { name: "React", category: "Frontend", proficiency: 90 },
    { name: "Node.js", category: "Backend", proficiency: 85 },
    { name: "PostgreSQL", category: "Database", proficiency: 80 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 95 }
  ];

  for (const skill of skillSet) {
    await storage.createSkill(skill);
  }
}
