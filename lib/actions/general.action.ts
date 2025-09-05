"use server"

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function getQuizzesByUserId(
    userId: string
): Promise<Quiz[] | null> {
    const quizzes = await db
        .collection("quizzes")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    return quizzes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Quiz[];
}

export async function getLatestQuizzes(
  params: GetLatestQuizzesParams
): Promise<Quiz[] | null> {
  const { userId, limit = 5 } = params;

  const quizzes = await db
    .collection("quizzes")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return quizzes.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Quiz[];
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  const quiz = await db.collection("quizzes").doc(id).get();

  return quiz.data() as Quiz | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { quizId, userId, transcript, quizType, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map((t) => `- ${t.role}: ${t.content}\n`)
      .join("");

    const prompt = `
You are an AI evaluator analyzing a voice-based quiz session on Knovo.

Quiz Type: ${quizType || "unknown"}
Transcript: 
${formattedTranscript}

EVALUATION GUIDELINES:
===================

1. SCORING SYSTEM:
   - Total score: 100 points
   - Distribute points equally among all questions
   - Use partial scoring when appropriate

2. EVALUATION CRITERIA BY QUIZ TYPE:

   For "true/false" or "multiple choice":
   ✓ Focus on: Correctness (70%) + Response Speed (30%)
   ✓ Deduct points for: Wrong answers, long hesitations, unclear responses
   ✓ Set other categories (Fluency, Articulation) to "N/A" or 0

   For "verbal answer":
   ✓ Focus on: Correctness (40%) + Fluency (30%) + Articulation (30%)
   ✓ Allow partial scores for partially correct answers
   ✓ Set Speed category to "N/A" or 0

3. OUTPUT FORMAT REQUIREMENTS:

   For MCQ/True-False quizzes, include:
   📋 **ANSWER KEY & COMPARISON**
   
   Question 1: [Question text]
   ✓ Correct Answer: [correct option]
   👤 User's Answer: [user's response] - [✅ Correct / ❌ Incorrect / ⚠️ Skipped]
   
   Question 2: [Question text]
   ✓ Correct Answer: [correct option]  
   👤 User's Answer: [user's response] - [✅ Correct / ❌ Incorrect / ⚠️ Skipped]
   
   [Continue for all questions...]

   For Verbal Answer quizzes:
   📝 **DETAILED RESPONSE ANALYSIS**
   
   Question 1: [Question text]
   👤 User's Response: [summarize key points from user's answer]
   📊 Assessment: [detailed evaluation of correctness, completeness]
   
   [Continue for all questions...]

4. REQUIRED SECTIONS:
   
   📊 **PER-QUESTION BREAKDOWN**
   - Question 1: [X]/[total points] - [brief reasoning]
   - Question 2: [X]/[total points] - [brief reasoning]
   [Continue for all questions...]
   
   📈 **CATEGORY-WISE SCORES**
   - Speed: [score]/25 (or N/A for verbal)
   - Accuracy: [score]/25
   - Fluency: [score]/25 (or N/A for MCQ/TF)  
   - Articulation: [score]/25 (or N/A for MCQ/TF)
   
   💪 **STRENGTHS**
   - [List 2-3 specific strengths observed]
   
   🎯 **AREAS FOR IMPROVEMENT**
   - [List 2-3 specific areas to work on, or "None" if performance was excellent]
   
   📋 **FINAL ASSESSMENT**
   [2-3 sentence overall summary with encouragement and next steps]

FORMATTING NOTES:
- Use clear headings with emojis for better readability
- Keep answer comparisons concise but clear
- Use ✅❌⚠️ symbols for visual clarity
- Avoid cluttered text - use line breaks and bullet points
- Make the feedback actionable and constructive
`;
    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt,
      system:
        "You are a smart voice quiz evaluator judging a user across different answer types with category-wise scores",
    });

     const feedback = {
      quizId: quizId!,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}
export async function getFeedbackByQuizId(
  params: GetFeedbackByQuizIdParams
): Promise<Feedback | null> {
  const { quizId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("quizId", "==", quizId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}