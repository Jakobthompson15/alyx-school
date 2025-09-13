import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getLessonPlan = internalQuery({
  args: { lessonPlanId: v.id("lessonPlans") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonPlanId);
  },
});

export const createQuizAssignment = internalMutation({
  args: {
    title: v.string(),
    subject: v.string(),
    teacherId: v.id("users"),
    questions: v.array(v.object({
      id: v.string(),
      question: v.string(),
      type: v.union(v.literal("multiple_choice"), v.literal("open_ended")),
      options: v.optional(v.array(v.string())),
      correctAnswer: v.string(),
      points: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const totalPoints = args.questions.reduce((sum, q) => sum + q.points, 0);

    return await ctx.db.insert("assignments", {
      title: args.title,
      description: "Auto-generated quiz from lesson plan",
      subject: args.subject as any,
      type: "quiz" as any,
      teacherId: args.teacherId,
      questions: args.questions,
      totalPoints,
      isPublished: true,
    });
  },
});

export const linkQuizToLessonPlan = internalMutation({
  args: {
    lessonPlanId: v.id("lessonPlans"),
    quizId: v.id("assignments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.lessonPlanId, {
      generatedQuizId: args.quizId,
    });
  },
});
