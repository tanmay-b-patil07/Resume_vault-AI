import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const userId = identity.subject;
    return await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    technologies: v.array(v.string()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }
    const userId = identity.subject;
    const id = await ctx.db.insert('projects', {
      userId,
      name: args.name,
      description: args.description,
      technologies: args.technologies,
      url: args.url,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id('projects'),
    name: v.string(),
    description: v.string(),
    technologies: v.array(v.string()),
    url: v.optional(v.string()),
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
      name: args.name,
      description: args.description,
      technologies: args.technologies,
      url: args.url,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id('projects'),
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
