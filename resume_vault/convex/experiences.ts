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
      .query('experiences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    company: v.string(),
    role: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    bullets: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }
    const userId = identity.subject;
    const id = await ctx.db.insert('experiences', {
      userId,
      company: args.company,
      role: args.role,
      startDate: args.startDate,
      endDate: args.endDate,
      bullets: args.bullets,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id('experiences'),
    company: v.string(),
    role: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    bullets: v.array(v.string()),
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
      company: args.company,
      role: args.role,
      startDate: args.startDate,
      endDate: args.endDate,
      bullets: args.bullets,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id('experiences'),
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
