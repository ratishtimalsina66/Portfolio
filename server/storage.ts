import { db } from "./db";
import {
  projects,
  skills,
  messages,
  experience,
  education,
  profile,
  type Project,
  type InsertProject,
  type Skill,
  type InsertSkill,
  type Message,
  type InsertMessage,
  type Experience,
  type InsertExperience,
  type Education,
  type InsertEducation,
  type Profile,
  type InsertProfile
} from "@shared/schema";
import { sql } from "drizzle-orm";

export interface IStorage {
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;

  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;

  getExperience(): Promise<Experience[]>;
  createExperience(exp: InsertExperience): Promise<Experience>;

  getEducation(): Promise<Education[]>;
  createEducation(edu: InsertEducation): Promise<Education>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  clearAllData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(): Promise<Profile | undefined> {
    const [userProfile] = await db.select().from(profile);
    return userProfile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [userProfile] = await db.insert(profile).values(insertProfile).returning();
    return userProfile;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db.insert(skills).values(insertSkill).returning();
    return skill;
  }

  async getExperience(): Promise<Experience[]> {
    return await db.select().from(experience);
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const [exp] = await db.insert(experience).values(insertExperience).returning();
    return exp;
  }

  async getEducation(): Promise<Education[]> {
    return await db.select().from(education);
  }

  async createEducation(insertEducation: InsertEducation): Promise<Education> {
    const [edu] = await db.insert(education).values(insertEducation).returning();
    return edu;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async clearAllData(): Promise<void> {
    await db.delete(profile);
    await db.delete(projects);
    await db.delete(skills);
    await db.delete(experience);
    await db.delete(education);
  }
}

export const storage = new DatabaseStorage();
