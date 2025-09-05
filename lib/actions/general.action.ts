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

Evaluation Rules:
1. The total score is 100.
2. Score should be equally divided among all questions.
3. For each question:
   - If quiz type is "true/false" or "multiple choice":
     - Evaluate based on **correctness** and **response speed**.
     - Deduct marks for delays, hesitations, or wrong answers.
     - Fill other sections with N/A.
   - If quiz type is "verbal answer":
     - Evaluate based on **fluency**, **articulation**, and **correctness**.
     - Partial scores are allowed.
     - Fill other sections with N/A and give score in them as '0'.
4. Provide:
   - A per-question score with reasoning
   - Category-wise breakdown (Speed, Accuracy, Fluency, etc.)
   - List of user strengths 
   - List of areas for improvement (If the user was perfect, say "None")
   - A final summary assessment in case of verbal answers. And for other types like MCQ/TF, Show the Answer Key (all correct answers) and compare it with the user's answers.

   FORMATTING REQUIREMENTS FOR MCQ/TRUE-FALSE:
=============================================
When displaying Answer Key and Comparison, use this EXACT format:

📋 **ANSWER KEY & COMPARISON:**

Question 1: [Question text]
✓ Correct Answer: [correct option/answer]
👤 User's Answer: [user's response] - [✅ Correct / ❌ Incorrect / ⚠️ Skipped]

Question 2: [Question text] 
✓ Correct Answer: [correct option/answer]
👤 User's Answer: [user's response] - [✅ Correct / ❌ Incorrect / ⚠️ Skipped]

[Continue this format for ALL questions...]
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