import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.TEACHER),
  v.literal(ROLES.STUDENT),
);
export type Role = Infer<typeof roleValidator>;

export const SUBJECTS = {
  STATISTICS: "Statistics",
  COMPUTER_SCIENCE: "Computer Science", 
  AP_ENGLISH: "AP English",
  SOCIAL_STUDIES: "Social Studies",
} as const;

export const subjectValidator = v.union(
  v.literal(SUBJECTS.STATISTICS),
  v.literal(SUBJECTS.COMPUTER_SCIENCE),
  v.literal(SUBJECTS.AP_ENGLISH),
  v.literal(SUBJECTS.SOCIAL_STUDIES),
);
export type Subject = Infer<typeof subjectValidator>;

export const ASSIGNMENT_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  OPEN_ENDED: "open_ended",
  QUIZ: "quiz",
} as const;

export const assignmentTypeValidator = v.union(
  v.literal(ASSIGNMENT_TYPES.MULTIPLE_CHOICE),
  v.literal(ASSIGNMENT_TYPES.OPEN_ENDED),
  v.literal(ASSIGNMENT_TYPES.QUIZ),
);
export type AssignmentType = Infer<typeof assignmentTypeValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      subjects: v.optional(v.array(subjectValidator)), // subjects for teachers
    }).index("email", ["email"]), // index for the email. do not remove or modify

    assignments: defineTable({
      title: v.string(),
      description: v.string(),
      subject: subjectValidator,
      type: assignmentTypeValidator,
      teacherId: v.id("users"),
      questions: v.array(v.object({
        id: v.string(),
        question: v.string(),
        type: v.union(v.literal("multiple_choice"), v.literal("open_ended")),
        options: v.optional(v.array(v.string())), // for multiple choice
        correctAnswer: v.string(), // correct answer or answer key
        points: v.number(),
      })),
      totalPoints: v.number(),
      dueDate: v.optional(v.number()),
      isPublished: v.boolean(),
    }).index("by_teacher", ["teacherId"])
      .index("by_subject", ["subject"])
      .index("by_published", ["isPublished"]),

    submissions: defineTable({
      assignmentId: v.id("assignments"),
      studentId: v.id("users"),
      answers: v.array(v.object({
        questionId: v.string(),
        answer: v.string(),
        isCorrect: v.optional(v.boolean()),
        points: v.optional(v.number()),
        feedback: v.optional(v.string()),
      })),
      totalScore: v.optional(v.number()),
      maxScore: v.number(),
      isGraded: v.boolean(),
      submittedAt: v.number(),
      gradedAt: v.optional(v.number()),
    }).index("by_assignment", ["assignmentId"])
      .index("by_student", ["studentId"])
      .index("by_assignment_and_student", ["assignmentId", "studentId"]),

    lessonPlans: defineTable({
      title: v.string(),
      subject: subjectValidator,
      teacherId: v.id("users"),
      content: v.string(),
      fileId: v.optional(v.id("_storage")),
      generatedQuizId: v.optional(v.id("assignments")),
    }).index("by_teacher", ["teacherId"])
      .index("by_subject", ["subject"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;