import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getSubmissionDetails = internalQuery({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) return null;

    const assignment = await ctx.db.get(submission.assignmentId);
    if (!assignment) return null;

    return {
      ...submission,
      assignment,
    };
  },
});

export const updateSubmissionGrades = internalMutation({
  args: {
    submissionId: v.id("submissions"),
    answers: v.array(v.object({
      questionId: v.string(),
      answer: v.string(),
      isCorrect: v.boolean(),
      points: v.number(),
      feedback: v.string(),
    })),
    totalScore: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, {
      answers: args.answers,
      totalScore: args.totalScore,
      isGraded: true,
      gradedAt: Date.now(),
    });
  },
});
