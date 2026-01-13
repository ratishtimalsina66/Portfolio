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

  // Seed data if empty
  const profile = await storage.getProfile();
  if (!profile) {
    await seedDatabase();
  }

  return httpServer;
}

async function seedDatabase() {
  await storage.createProfile({
    name: "Alex Johnson",
    title: "Senior Full Stack Engineer",
    summary: "Dedicated Full Stack Engineer with 7+ years of experience in building scalable web applications. Proficient in React, Node.js, and cloud architecture. Strong advocate for clean code and collaborative development.",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    github: "github.com/alexj",
    linkedin: "linkedin.com/in/alexjohnson"
  });

  await storage.createProject({
    title: "Eco-Track Analytics",
    description: "Built a real-time carbon footprint monitoring dashboard for enterprise clients. Reduced data processing time by 40% using optimized Redis caching.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    projectUrl: "https://eco-track.example.com",
    repoUrl: "https://github.com/alexj/eco-track",
    tags: ["React", "TypeScript", "Node.js", "Redis"]
  });

  await storage.createProject({
    title: "SecurePay Gateway",
    description: "Designed and implemented a PCI-compliant payment gateway integration serving 50k+ monthly transactions. Enhanced security with multi-factor authentication.",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    projectUrl: "https://securepay.example.com",
    repoUrl: "https://github.com/alexj/securepay",
    tags: ["Go", "PostgreSQL", "AWS", "Docker"]
  });

  await storage.createExperience({
    company: "CloudScale Systems",
    position: "Senior Software Engineer",
    location: "San Francisco, CA",
    duration: "2021 - Present",
    description: "Architected a microservices-based platform serving millions of users. Improved system uptime to 99.99% and mentored a team of 5 developers."
  });

  await storage.createExperience({
    company: "Innovate Web Lab",
    position: "Full Stack Developer",
    location: "Austin, TX",
    duration: "2018 - 2021",
    description: "Developed 20+ custom web solutions for diverse clients. Streamlined deployment processes using automated Jenkins pipelines."
  });

  await storage.createEducation({
    institution: "Stanford University",
    degree: "Master of Science in Computer Science",
    duration: "2016 - 2018"
  });

  await storage.createEducation({
    institution: "University of California, Berkeley",
    degree: "Bachelor of Science in Electrical Engineering and Computer Science",
    duration: "2012 - 2016"
  });

  const skillSet = [
    { name: "React", category: "Frontend", proficiency: 95 },
    { name: "Node.js", category: "Backend", proficiency: 90 },
    { name: "TypeScript", category: "Languages", proficiency: 90 },
    { name: "Python", category: "Languages", proficiency: 80 },
    { name: "PostgreSQL", category: "Database", proficiency: 85 },
    { name: "AWS", category: "DevOps", proficiency: 80 },
    { name: "Docker", category: "DevOps", proficiency: 85 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 95 }
  ];

  for (const skill of skillSet) {
    await storage.createSkill(skill);
  }
}
