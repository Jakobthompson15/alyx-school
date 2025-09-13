import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const create = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    content: v.string(),
    fileId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "teacher") {
      throw new Error("Only teachers can create lesson plans");
    }

    return await ctx.db.insert("lessonPlans", {
      title: args.title,
      subject: args.subject as any,
      teacherId: user._id,
      content: args.content,
      fileId: args.fileId,
    });
  },
});

export const getByTeacher = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "teacher") {
      return [];
    }

    return await ctx.db
      .query("lessonPlans")
      .withIndex("by_teacher", (q) => q.eq("teacherId", user._id))
      .collect();
  },
});