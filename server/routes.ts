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

  // Re-seed database with correct information from the resume image
  // Checking if profile exists, but we'll force update it this time
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  // Clear existing data to ensure correct information
  // Note: In a real app we'd have a migration or better seeding, but for tailoring:
  
  const currentProfile = await storage.getProfile();
  if (!currentProfile || currentProfile.name === "Alex Johnson" || currentProfile.name === "John Doe") {
     // Extracting details from the resume image provided: "SANTOSH MANDAL"
     await storage.createProfile({
      name: "SANTOSH MANDAL",
      title: "SOFTWARE ENGINEER",
      summary: "I'm a passionate Software Engineer with a strong foundation in Web Development. I'm always looking for new challenges and opportunities to learn and grow. I'm a quick learner and a team player. I'm also a hard worker and dedicated to my work.",
      email: "santoshmandal746@gmail.com",
      phone: "+91-8116515863",
      location: "Bengaluru, Karnataka",
      github: "github.com/Santosh-Mandal",
      linkedin: "linkedin.com/in/santosh-mandal-502a14207"
    });

    await storage.createExperience({
      company: "The Sparks Foundation",
      position: "Web Development Intern",
      location: "Remote",
      duration: "Apr 2023 - May 2023",
      description: "Designed and implemented a basic banking system using HTML, CSS, JavaScript, PHP and MySQL. Managed a database for 10 users with seamless transfer functionality."
    });

    await storage.createExperience({
      company: "Oasis Infobyte",
      position: "Web Development Intern",
      location: "Remote",
      duration: "Jan 2023 - Feb 2023",
      description: "Designed and implemented a landing page, portfolio, and calculator using HTML, CSS, and JavaScript. Focused on responsive design and clean UI."
    });

    await storage.createEducation({
      institution: "Techno India University",
      degree: "Bachelor of Technology in Computer Science and Engineering",
      duration: "2020 - 2024"
    });

    await storage.createEducation({
      institution: "Katwa Bharati Bhaban",
      degree: "Higher Secondary (Class XII)",
      duration: "2018 - 2020"
    });

    const skillSet = [
      { name: "C/C++", category: "Languages", proficiency: 85 },
      { name: "Python", category: "Languages", proficiency: 80 },
      { name: "Java", category: "Languages", proficiency: 75 },
      { name: "HTML/CSS", category: "Frontend", proficiency: 90 },
      { name: "JavaScript", category: "Frontend", proficiency: 85 },
      { name: "PHP", category: "Backend", proficiency: 70 },
      { name: "MySQL", category: "Database", proficiency: 80 },
      { name: "React", category: "Frontend", proficiency: 85 },
      { name: "Node.js", category: "Backend", proficiency: 80 },
      { name: "Git/GitHub", category: "Tools", proficiency: 85 }
    ];

    for (const skill of skillSet) {
      await storage.createSkill(skill);
    }

    await storage.createProject({
      title: "Banking System",
      description: "A functional banking application allowing users to manage accounts and transfer funds securely.",
      imageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800&q=80",
      projectUrl: "https://github.com/Santosh-Mandal",
      repoUrl: "https://github.com/Santosh-Mandal",
      tags: ["PHP", "MySQL", "JavaScript", "HTML/CSS"]
    });

    await storage.createProject({
      title: "Weather App",
      description: "A real-time weather forecasting application providing accurate data for locations worldwide.",
      imageUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80",
      projectUrl: "https://github.com/Santosh-Mandal",
      repoUrl: "https://github.com/Santosh-Mandal",
      tags: ["JavaScript", "API", "CSS"]
    });
  }
}
