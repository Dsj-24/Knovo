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
You are an AI evaluator analyzing a voice-based quiz session transcript from the Knovo platform. Your goal is to provide a detailed, well-structured evaluation based on the rules provided.

**Quiz Type:** ${quizType || "unknown"}

**Transcript of the Session:**
${formattedTranscript}

---

### **Evaluation Rules & Output Structure**

**1. Scoring:**
   - The total score for the quiz is 100.
   - The score must be divided equally among all questions present in the transcript.

**2. Evaluation Criteria (Based on Quiz Type):**
   - **For "True/False" or "Multiple Choice" Quizzes:**
     - Evaluate primarily on **correctness** and **response speed**.
     - Deduct marks for incorrect answers, significant delays, or expressions of uncertainty.
     - For other categories like Fluency/Articulation, mark them as 'N/A' and assign a score of '0'.
   - **For "Verbal Answer" Quizzes:**
     - Evaluate based on a combination of **fluency**, **articulation**, **correctness**, and **response speed**.
     - Partial scores are encouraged for answers that are partially correct or well-articulated but slightly inaccurate.
     - An answer is considered an "Invalid Response" if it does not match the expected format.
     - Examples:
        - For a True/False question, if the transcript shows "calls", "coils", "blue", or any word other than "True" or "False", it is invalid.
        - For an MCQ, if the transcript shows "Option see" instead of "Option C", it is invalid.
     - Try to interpret these as correct answers but they must be flagged as invalid.

**3. Required Output Sections:**
   You must provide the following sections in your evaluation:
   - A per-question score with brief reasoning.
   - Category-wise score breakdown (e.g., Speed, Accuracy, Fluency).
   - A bulleted list of user strengths.
   - A bulleted list of areas for improvement (If the user was perfect, state "None").
   - A final summary assessment for "Verbal Answer" quizzes OR an "Answer Key & Comparison" for other types.

**4. Critical formatting instructions for MCQ / TRUE/FALSE**
   - This section is mandatory for "Multiple Choice" and "True/False" quizzes. You MUST generate the "Answer Key & Comparison" using the precise format below. **Ensure there is a blank line between each question's entry for readability.**
   - Answer Key & Comparison:

   // Start

     Question 1: [Full text of the first question]
     ✓ Correct Answer: [The correct option or answer, e.g., "Paris" or "True"]
     Your Answer: [The user's response] - [Correct / Incorrect / Skipped] .

     Question 2: [Full text of the second question]
     ✓ Correct Answer: [The correct option or answer]
     Your Answer: [The user's response] - [Correct / Incorrect / Skipped] .

     [Same for Rest of the questions...]

   // End

   - After each question, correct answer and your answer , add a full stop (.) to indicate the end of that entry.

(Continue this exact format for all subsequent questions in the quiz)
`;
    const { object } = await generateObject({
      model: google("gemini-2.5-pro", {
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
      finalAssessment: object.finalAssessment.replaceAll('.', '.\n'),
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