import { mutation } from "./_generated/server";

export const seedTestAccounts = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if accounts already exist
    const existingTeacher = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", "teacher@example.com"))
      .unique();

    const existingStudent = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", "student@example.com"))
      .unique();

    if (existingTeacher && existingStudent) {
      return { message: "Test accounts already exist" };
    }

    // Create teacher account
    if (!existingTeacher) {
      await ctx.db.insert("users", {
        name: "Ms. Johnson",
        email: "teacher@example.com",
        role: "teacher",
        subjects: ["Statistics", "Computer Science", "AP English", "Social Studies"],
        emailVerificationTime: Date.now(),
        isAnonymous: false,
      });
    }

    // Create student account
    if (!existingStudent) {
      await ctx.db.insert("users", {
        name: "Alex Smith",
        email: "student@example.com", 
        role: "student",
        emailVerificationTime: Date.now(),
        isAnonymous: false,
      });
    }

    return { message: "Test accounts created successfully" };
  },
});
