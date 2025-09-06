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
    - The score must be divided equally among all questions present in the transcript. Questions with an invalid response should receive 0 marks.

**2. Evaluation Criteria (Based on Quiz Type):**
    - **For "True/False" or "Multiple Choice" Quizzes:**
      - Evaluate primarily on **correctness** and **response speed**.
      - Deduct marks for incorrect answers, invalid responses, significant delays, or expressions of uncertainty.
      - For other categories like Fluency/Articulation, mark them as 'N/A' and assign a score of '0'.
    - **For "Verbal Answer" Quizzes:**
      - Evaluate based on a combination of **fluency**, **articulation**, **correctness**, and **response speed**.
      - Partial scores are encouraged for answers that are partially correct or well-articulated but slightly inaccurate.

**3. Handling Invalid/Unclear Responses (CRITICAL for MCQ and True/False):**
    - An answer is considered an "Invalid Response" if it does not match the expected format.
    - Examples:
        - For a True/False question, if the transcript shows "calls", "coils", "blue", or any word other than "True" or "False", it is invalid.
        - For an MCQ, if the transcript shows "Option see" instead of "Option C", it is invalid.
    - Do NOT try to interpret these as correct answers. They must be flagged as invalid.

**4. Required Output Sections:**
    You must provide the following sections in your evaluation:
    - A brief summary paragraph.
    - A per-question "Answer Key & Comparison".
    - Category-wise score breakdown (e.g., Speed, Accuracy, Fluency).
    - A bulleted list of user strengths.
    - A bulleted list of areas for improvement (If the user was perfect, state "None").

---

### **CRITICAL FORMATTING INSTRUCTIONS FOR MCQ / TRUE/FALSE**

This section is mandatory for "Multiple Choice" and "True/False" quizzes.

**A. Summary Paragraph:**
Start with a concise, 2-3 sentence paragraph. State the overall score, the number of correctly answered questions, and the primary reason for score deductions (e.g., issues with response clarity leading to invalid answers, or incorrect answers). **Avoid using bold markdown ("**") within this paragraph.**

**B. Answer Key & Comparison:**
You MUST generate this section using the precise format below. **Ensure there is a blank line between each question's entry for readability.**

**Question 1:** [Full text of the first question]
* ✓ **Correct Answer:** [The correct option or answer]
* Your Answer: [The user's transcribed response] - **[Correct / Incorrect / Skipped / Invalid Response]**

**Question 2:** [Full text of the second question]
* ✓ **Correct Answer:** [The correct option or answer]
* Your Answer: [The user's transcribed response] - **[Correct / Incorrect / Skipped / Invalid Response]**

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