import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllUsers = query(async ({ db }) => {
  return await db.query("users").collect();
});

export const createUser = mutation({
  args: {
    name: v.string(),
    age: v.number(),
    isActive: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", args);
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.string(),
    age: v.number(),
    isActive: v.boolean(),
    updatedAt: v.string(),
  },
  handler: async (ctx, { id, ...rest }) => {
    await ctx.db.patch(id, rest);
  },
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
