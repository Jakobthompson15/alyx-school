import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const submit = mutation({
  args: {
    assignmentId: v.id("assignments"),
    answers: v.array(v.object({
      questionId: v.string(),
      answer: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "student") {
      throw new Error("Only students can submit assignments");
    }

    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment || !assignment.isPublished) {
      throw new Error("Assignment not found or not published");
    }

    // Check if already submitted
    const existing = await ctx.db
      .query("submissions")
      .withIndex("by_assignment_and_student", (q) => 
        q.eq("assignmentId", args.assignmentId).eq("studentId", user._id)
      )
      .unique();

    if (existing) {
      throw new Error("Assignment already submitted");
    }

    const submissionAnswers = args.answers.map(answer => ({
      questionId: answer.questionId,
      answer: answer.answer,
    }));

    return await ctx.db.insert("submissions", {
      assignmentId: args.assignmentId,
      studentId: user._id,
      answers: submissionAnswers,
      maxScore: assignment.totalPoints,
      isGraded: false,
      submittedAt: Date.now(),
    });
  },
});

export const getByStudent = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "student") {
      return [];
    }

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_student", (q) => q.eq("studentId", user._id))
      .collect();

    // Get assignment details for each submission
    const submissionsWithAssignments = await Promise.all(
      submissions.map(async (submission) => {
        const assignment = await ctx.db.get(submission.assignmentId);
        return {
          ...submission,
          assignment,
        };
      })
    );

    return submissionsWithAssignments;
  },
});

export const getByAssignment = query({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "teacher") {
      return [];
    }

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_assignment", (q) => q.eq("assignmentId", args.assignmentId))
      .collect();

    // Get student details for each submission
    const submissionsWithStudents = await Promise.all(
      submissions.map(async (submission) => {
        const student = await ctx.db.get(submission.studentId);
        return {
          ...submission,
          student,
        };
      })
    );

    return submissionsWithStudents;
  },
});

export const getSubmission = query({
  args: { 
    assignmentId: v.id("assignments"),
    studentId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const studentId = args.studentId || user._id;

    // Students can only see their own submissions
    if (user.role === "student" && studentId !== user._id) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("submissions")
      .withIndex("by_assignment_and_student", (q) => 
        q.eq("assignmentId", args.assignmentId).eq("studentId", studentId)
      )
      .unique();
  },
});
