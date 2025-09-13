import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    subject: v.string(),
    type: v.string(),
    questions: v.array(v.object({
      id: v.string(),
      question: v.string(),
      type: v.union(v.literal("multiple_choice"), v.literal("open_ended")),
      options: v.optional(v.array(v.string())),
      correctAnswer: v.string(),
      points: v.number(),
    })),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "teacher") {
      throw new Error("Only teachers can create assignments");
    }

    const totalPoints = args.questions.reduce((sum, q) => sum + q.points, 0);

    return await ctx.db.insert("assignments", {
      title: args.title,
      description: args.description,
      subject: args.subject as any,
      type: args.type as any,
      teacherId: user._id,
      questions: args.questions,
      totalPoints,
      dueDate: args.dueDate,
      isPublished: false,
    });
  },
});

export const publish = mutation({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "teacher") {
      throw new Error("Only teachers can publish assignments");
    }

    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment || assignment.teacherId !== user._id) {
      throw new Error("Assignment not found or unauthorized");
    }

    await ctx.db.patch(args.assignmentId, { isPublished: true });
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
      .query("assignments")
      .withIndex("by_teacher", (q) => q.eq("teacherId", user._id))
      .collect();
  },
});

export const getPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("assignments")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();
  },
});

export const getById = query({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.assignmentId);
  },
});

export const getBySubject = query({
  args: { subject: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "teacher") {
      return [];
    }

    return await ctx.db
      .query("assignments")
      .withIndex("by_subject", (q) => q.eq("subject", args.subject as any))
      .filter((q) => q.eq(q.field("teacherId"), user._id))
      .collect();
  },
});
