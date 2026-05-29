import { v } from 'convex/values';
import { action, mutation, query } from './_generated/server';
import { api } from './_generated/api';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const userId = identity.subject;
    return await ctx.db
      .query('applications')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

export const get = query({
  args: {
    id: v.id('applications'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }
    const userId = identity.subject;
    const app = await ctx.db.get(args.id);
    if (!app || app.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return app;
  },
});

export const add = mutation({
  args: {
    company: v.string(),
    jobTitle: v.string(),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }
    const userId = identity.subject;
    const id = await ctx.db.insert('applications', {
      userId,
      company: args.company,
      jobTitle: args.jobTitle,
      jobDescription: args.jobDescription,
      status: 'Discovered',
      updatedAt: Date.now(),
    });
    return id;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('applications'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }
    const userId = identity.subject;
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== userId) {
      throw new Error('Unauthorized');
    }
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const updateResume = mutation({
  args: {
    id: v.id('applications'),
    resume: v.object({
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
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }
    const userId = identity.subject;
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== userId) {
      throw new Error('Unauthorized');
    }
    await ctx.db.patch(args.id, {
      tailoredResume: args.resume,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id('applications'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }
    const userId = identity.subject;
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== userId) {
      throw new Error('Unauthorized');
    }
    await ctx.db.delete(args.id);
  },
});

export const tailor = action({
  args: {
    applicationId: v.id('applications'),
  },
  handler: async (ctx, args) => {
    // 1. Set status to "Tailoring"
    await ctx.runMutation(api.applications.updateStatus, {
      id: args.applicationId,
      status: 'Tailoring',
    });

    // Fetch the application and user master database
    const application = await ctx.runQuery(api.applications.get, {
      id: args.applicationId,
    });
    if (!application) {
      throw new Error('Application not found');
    }

    const masterExperiences = await ctx.runQuery(api.experiences.list, {});
    const masterProjects = await ctx.runQuery(api.projects.list, {});
    const masterSkills = await ctx.runQuery(api.skills.list, {});

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Get current user identity details for header info
    const identity = await ctx.auth.getUserIdentity();
    const userName = identity?.name || 'Jane Doe';
    const userEmail = identity?.email || 'jane.doe@example.com';

    // Step 1: Analyze JD (1.5s delay)
    await sleep(1500);

    const jobTitle = application.jobTitle;
    const company = application.company;
    const jd = application.jobDescription;

    const tailoredSummary = `Results-oriented professional tailoring career history to excel as a ${jobTitle} at ${company}. Proven skills aligning technical initiatives with core project specifications. Expert at analyzing complex user requirements and transforming them into scalable, high-performance web applications, leveraging master capabilities to drive modern frontend excellence.`;

    // Write phase 1 (personalInfo and summary)
    await ctx.runMutation(api.applications.updateResume, {
      id: args.applicationId,
      resume: {
        personalInfo: {
          name: userName,
          email: userEmail,
          phone: '+1 (555) 019-2834',
          website: 'portfolio.dev',
          linkedin: 'linkedin.com/in/janedoe',
          location: 'San Francisco, CA',
        },
        summary: tailoredSummary,
        experiences: [],
        projects: [],
        skills: [],
      },
    });

    // Step 2: Tailor Work Experience (2.5s delay)
    await sleep(2500);

    const tailoredExperiences = masterExperiences.map((exp) => {
      const tailoredBullets = exp.bullets.map((bullet) => {
        // Synthesise tailoring keywords
        if (jd.toLowerCase().includes('react') && bullet.toLowerCase().includes('react')) {
          return `${bullet} - specifically optimizing component trees and state management for seamless UX.`;
        }
        if (jd.toLowerCase().includes('cloud') && bullet.toLowerCase().includes('deploy')) {
          return `${bullet} utilizing AWS Cloud infrastructure and containerized microservices to guarantee 99.9% uptime.`;
        }
        if (jd.toLowerCase().includes('agile') || jd.toLowerCase().includes('team')) {
          return `${bullet} working within cross-functional agile sprints to accelerate feature deployment by 20%.`;
        }
        return bullet;
      });

      return {
        company: exp.company,
        role: exp.role,
        duration: `${exp.startDate} - ${exp.endDate}`,
        bullets: tailoredBullets.length > 0 ? tailoredBullets : [
          `Led development of high-priority software features for ${exp.company} as ${exp.role}.`,
          `Configured data pipelines and optimized application rendering speeds.`
        ],
      };
    });

    // If no master experiences exist, provide beautiful templates
    const finalExperiences = tailoredExperiences.length > 0 ? tailoredExperiences : [
      {
        company: 'InnovateTech Systems',
        role: 'Senior Software Engineer',
        duration: 'Jan 2023 - Present',
        bullets: [
          `Architected high-throughput responsive user interfaces, aligning design constraints with the ${jobTitle} role expectations.`,
          'Collaborated with product designers to design RESTful endpoint routing and backend integrations.',
          'Reduced web-app load times by 35% through code splitting, lazy loading, and asset compilation.'
        ],
      },
      {
        company: 'ByteCraft Solutions',
        role: 'Full Stack Developer',
        duration: 'Jun 2021 - Dec 2022',
        bullets: [
          'Developed microservice integrations in node environments, streamlining data pipelines.',
          'Maintained high testing coverage (85%+) using Jest and Cypress to minimize deployment regressions.'
        ],
      }
    ];

    await ctx.runMutation(api.applications.updateResume, {
      id: args.applicationId,
      resume: {
        personalInfo: {
          name: userName,
          email: userEmail,
          phone: '+1 (555) 019-2834',
          website: 'portfolio.dev',
          linkedin: 'linkedin.com/in/janedoe',
          location: 'San Francisco, CA',
        },
        summary: tailoredSummary,
        experiences: finalExperiences,
        projects: [],
        skills: [],
      },
    });

    // Step 3: Match Projects & Skills (2.0s delay)
    await sleep(2000);

    const tailoredProjects = masterProjects.map((p) => ({
      name: p.name,
      description: `${p.description} (Customized to match key requirements for ${company}'s software stack).`,
      technologies: p.technologies,
    }));

    const finalProjects = tailoredProjects.length > 0 ? tailoredProjects : [
      {
        name: 'Distributed Cloud Scheduler',
        description: `High-availability job scheduler designed for heavy query environments, customized to match key requirements for ${company}'s software stack.`,
        technologies: ['React', 'TypeScript', 'Node.js', 'Docker'],
      },
      {
        name: 'Analytics Insights Dashboard',
        description: 'Real-time telemetry reporting panel tracking client-side interaction events with responsive charts.',
        technologies: ['Vite', 'Tailwind CSS', 'D3.js', 'Convex'],
      }
    ];

    // Group master skills by category
    const skillsGrouped: Record<string, string[]> = {};
    masterSkills.forEach((s) => {
      const cat = s.category || 'Technologies';
      if (!skillsGrouped[cat]) {
        skillsGrouped[cat] = [];
      }
      skillsGrouped[cat].push(s.name);
    });

    // Defaults if empty
    if (Object.keys(skillsGrouped).length === 0) {
      skillsGrouped['Languages'] = ['TypeScript', 'JavaScript', 'HTML/CSS', 'Python'];
      skillsGrouped['Frameworks & Libs'] = ['React.js', 'Next.js', 'Vite', 'Tailwind CSS'];
      skillsGrouped['Backend & Databases'] = ['Convex', 'Node.js', 'PostgreSQL', 'REST APIs'];
      skillsGrouped['Tools & Platforms'] = ['Git', 'Docker', 'AWS', 'Vercel'];
    }

    const tailoredSkills = Object.entries(skillsGrouped).map(([category, items]) => ({
      category,
      items,
    }));

    await ctx.runMutation(api.applications.updateResume, {
      id: args.applicationId,
      resume: {
        personalInfo: {
          name: userName,
          email: userEmail,
          phone: '+1 (555) 019-2834',
          website: 'portfolio.dev',
          linkedin: 'linkedin.com/in/janedoe',
          location: 'San Francisco, CA',
        },
        summary: tailoredSummary,
        experiences: finalExperiences,
        projects: finalProjects,
        skills: tailoredSkills,
      },
    });

    // Step 4: Final Polish (1.0s delay)
    await sleep(1000);

    // Update status to "Applied"
    await ctx.runMutation(api.applications.updateStatus, {
      id: args.applicationId,
      status: 'Applied',
    });
  },
});
