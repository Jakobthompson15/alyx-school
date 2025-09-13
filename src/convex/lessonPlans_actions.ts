"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const generateQuizFromLessonPlan: any = action({
  args: { lessonPlanId: v.id("lessonPlans") },
  handler: async (ctx, args) => {
    const lessonPlan: any = await ctx.runQuery(internal.lessonPlans_internal.getLessonPlan, {
      lessonPlanId: args.lessonPlanId,
    });

    if (!lessonPlan) {
      return { success: false, error: "Lesson plan not found" };
    }

    try {
      const quiz = await generateQuizFromContent(lessonPlan.content, lessonPlan.subject);

      const assignmentId: any = await ctx.runMutation(internal.lessonPlans_internal.createQuizAssignment, {
        title: `Quiz: ${lessonPlan.title}`,
        subject: lessonPlan.subject,
        teacherId: lessonPlan.teacherId,
        questions: quiz.questions,
      });

      await ctx.runMutation(internal.lessonPlans_internal.linkQuizToLessonPlan, {
        lessonPlanId: args.lessonPlanId,
        quizId: assignmentId,
      });

      return { success: true, assignmentId };
    } catch (error) {
      console.error("Quiz generation failed:", error);
      return { success: false, error: "Failed to generate quiz" };
    }
  },
});

async function generateQuizFromContent(content: string, subject: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  const prompt = `Create a quiz based on this lesson plan content for ${subject}:

${content}

Generate 5-8 questions that test understanding of the key concepts. Include a mix of multiple choice and short answer questions.

Respond in JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "type": "multiple_choice",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "points": 10
    },
    {
      "id": "q2", 
      "question": "Question text",
      "type": "open_ended",
      "correctAnswer": "Expected answer or key points",
      "points": 15
    }
  ]
}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content_response = data.choices[0]?.message?.content;

  if (!content_response) {
    throw new Error("No response from AI");
  }

  return JSON.parse(content_response);
}
