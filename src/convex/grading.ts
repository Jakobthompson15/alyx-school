"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const gradeSubmission: any = action({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args): Promise<{ success: boolean; totalScore?: number; maxScore?: number; error?: string }> => {
    // Get submission and assignment details
    const submission: any = await ctx.runQuery(internal.grading.getSubmissionDetails, {
      submissionId: args.submissionId,
    });

    if (!submission || submission.isGraded) {
      return { success: false, error: "Submission not found or already graded" };
    }

    const gradedAnswers = [];
    let totalScore = 0;

    for (const answer of submission.answers) {
      const question = submission.assignment.questions.find((q: any) => q.id === answer.questionId);
      if (!question) continue;

      let isCorrect = false;
      let points = 0;
      let feedback = "";

      if (question.type === "multiple_choice") {
        isCorrect = answer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
        points = isCorrect ? question.points : 0;
        feedback = isCorrect ? "Correct!" : `Incorrect. The correct answer is: ${question.correctAnswer}`;
      } else if (question.type === "open_ended") {
        // Use AI to grade open-ended questions
        try {
          const aiGrading = await gradeOpenEndedQuestion(
            question.question,
            question.correctAnswer,
            answer.answer,
            question.points
          );
          isCorrect = aiGrading.score >= (question.points * 0.7); // 70% threshold
          points = aiGrading.score;
          feedback = aiGrading.feedback;
        } catch (error) {
          console.error("AI grading failed:", error);
          // Fallback: give partial credit
          points = question.points * 0.5;
          feedback = "Auto-grading unavailable. Partial credit given. Teacher review needed.";
        }
      }

      gradedAnswers.push({
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
        points,
        feedback,
      });

      totalScore += points;
    }

    // Update submission with grades
    await ctx.runMutation(internal.grading.updateSubmissionGrades, {
      submissionId: args.submissionId,
      answers: gradedAnswers,
      totalScore,
    });

    return { success: true, totalScore, maxScore: submission.assignment.totalPoints };
  },
});

async function gradeOpenEndedQuestion(
  question: string,
  correctAnswer: string,
  studentAnswer: string,
  maxPoints: number
): Promise<{ score: number; feedback: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  const prompt = `You are an AI grading assistant. Grade the following student answer:

Question: ${question}

Correct/Expected Answer: ${correctAnswer}

Student Answer: ${studentAnswer}

Maximum Points: ${maxPoints}

Please provide:
1. A score out of ${maxPoints} points (can be decimal)
2. Brief constructive feedback

Respond in JSON format:
{
  "score": <number>,
  "feedback": "<string>"
}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response from AI");
  }

  try {
    const result = JSON.parse(content);
    return {
      score: Math.min(Math.max(0, result.score), maxPoints), // Clamp between 0 and maxPoints
      feedback: result.feedback || "No feedback provided",
    };
  } catch (error) {
    throw new Error("Invalid AI response format");
  }
}
