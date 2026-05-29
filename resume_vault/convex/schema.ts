import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  
  experiences: defineTable({
    userId: v.string(),
    company: v.string(),
    role: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    bullets: v.array(v.string()),
  }).index('by_user', ['userId']),
  
  projects: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    technologies: v.array(v.string()),
    url: v.optional(v.string()),
  }).index('by_user', ['userId']),
  
  skills: defineTable({
    userId: v.string(),
    name: v.string(),
    category: v.string(),
  }).index('by_user', ['userId']),
  
  applications: defineTable({
    userId: v.string(),
    company: v.string(),
    jobTitle: v.string(),
    jobDescription: v.string(),
    status: v.string(), // "Discovered" | "Tailoring" | "Applied" | "Interviewing"
    tailoredResume: v.optional(
      v.object({
        personalInfo: v.object({
          name: v.string(),
          email: v.string(),
          phone: v.string(),
          website: v.optional(v.string()),
          linkedin: v.optional(v.string()),
          location: v.optional(v.string()),
        }),
        summary: v.string(),
        experiences: v.array(
          v.object({
            company: v.string(),
            role: v.string(),
            duration: v.string(),
            bullets: v.array(v.string()),
          })
        ),
        projects: v.array(
          v.object({
            name: v.string(),
            description: v.string(),
            technologies: v.array(v.string()),
          })
        ),
        skills: v.array(
          v.object({
            category: v.string(),
            items: v.array(v.string()),
          })
        ),
      })
    ),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),
});
