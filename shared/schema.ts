import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  projectUrl: text("project_url"),
  repoUrl: text("repo_url"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), 
  proficiency: integer("proficiency").default(0), 
});

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  location: text("location"),
  duration: text("duration").notNull(),
  description: text("description").notNull(),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  duration: text("duration").notNull(),
});

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  github: text("github"),
  linkedin: text("linkedin"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertExperienceSchema = createInsertSchema(experience).omit({ id: true });
export const insertEducationSchema = createInsertSchema(education).omit({ id: true });
export const insertProfileSchema = createInsertSchema(profile).omit({ id: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Experience = typeof experience.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Profile = typeof profile.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
