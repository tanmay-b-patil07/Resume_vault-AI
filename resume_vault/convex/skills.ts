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
      .query('skills')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }
    const userId = identity.subject;
    const id = await ctx.db.insert('skills', {
      userId,
      name: args.name,
      category: args.category,
    });
    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('skills'),
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
