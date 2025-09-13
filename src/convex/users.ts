import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { roleValidator, subjectValidator } from "./schema";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 * Usage: const signedInUser = await ctx.runQuery(api.authHelpers.currentUser);
 * THIS FUNCTION IS READ-ONLY. DO NOT MODIFY.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (user === null) {
      return null;
    }

    return user;
  },
});

/**
 * Use this function internally to get the current user data. Remember to handle the null user case.
 * @param ctx
 * @returns
 */
export const getCurrentUser = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  return await ctx.db.get(userId);
};

// Add profile/role setter for anonymous users to quickly start without email auth
export const setProfile = mutation({
  args: {
    role: roleValidator,
    name: v.optional(v.string()),
    subjects: v.optional(v.array(subjectValidator)),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const updates: Record<string, any> = {
      role: args.role,
    };
    if (args.name) updates.name = args.name;
    if (args.role === "teacher") {
      updates.subjects = args.subjects ?? ["Statistics", "Computer Science", "AP English", "Social Studies"];
    }
    await ctx.db.patch(userId, updates);
    return true;
  },
});