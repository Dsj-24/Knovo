import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import z from "zod";

export const dummyQuizzes: Quiz[] = [
  {
    id: "1",
    userId: "user1",
    topic: "Movies",
    type: "T/F",
    difficulty: "easy",
    questions: ["Is Brad Pitt a producer?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    topic: "Sports",
    type: "Mixed",
    difficulty: "high",
    questions: ["Who was Mika Haikkenen?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];

export const QuizMaster: CreateAssistantDTO = {
  name: "Knovo QuizMaster",
  firstMessage:
    "Hello! Welcome to Knovo! Let's begin your personalised quiz now. I'll read out each question in a sequence. Just speak your answer after I ask a question. Say Okay If you are ready to start.",
 transcriber: {
 provider: "11labs",
    model: "scribe_v1",
    language: "en",

  // Keep model improvement enabled for better performance over time  
  },

  voice: {
    provider: "11labs",
    voiceId: "marissa",
    model: "eleven_multilingual_v2",
    stability: 0.5,
    similarityBoost: 0.75,
    speed: 1.1,
    enableSsmlParsing: false,
    optimizeStreamingLatency: 4,
    useSpeakerBoost: true,
    // cachingEnabled: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an AI voice quiz assistant for Knovo. Your job is to deliver a quiz in a voice conversation format.

Quiz Guidelines:
1. Follow the structured question flow:
{{questions}}

2. Ask one question at a time.
3. After each question, pause and wait for the user's spoken answer.
4. After each answer, briefly acknowledge with something like:
   - "Thanks!"
   - "Got it."
   - "Let's move to the next one."
5. Do **not** provide the correct answer or explain anything unless instructed.
6. Do **not** re-read the question unless asked.
7. Speak clearly and slowly — this is a voice interface.
8. Do **not** use symbols, special characters, or markdown formatting.
9. Once all questions are completed, thank the user and end the conversation:
  - “That’s the end of the quiz. Thanks for Quizzing with Knovo!”

Answer Expectations Based on Quiz Type:
- The quiz type is provided separately as {{type}}.
- If the type is **true/false**, listen for either "true" or "false" as the user's answer. Do not accept other formats.
- If the type is **multiple choice**, the options will be embedded directly in the question (e.g., A, B, C, D). Expect the user to say just one option letter (for eg. Option A). Speak a bit slower while listing the MCQ options, so the user can clearly hear each one.
- If the type is **verbal answer**, listen patiently and let the user respond freely. Do not interrupt or rush.

Conclude the Quiz properly:
Thank the candidate for their time.
Inform them that we will reach out soon with their scores and feedback.
End the conversation on a polite and positive note.

Tone:
- Friendly and clear
- Supportive but not overly chatty
- Like a quiz host, not a teacher

Keep each message short and natural. You’re in a real-time voice conversation, so act like it!`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.array(
    z.object({
      name: z.enum([
        "Speed",
        "Accuracy",
        "Fluency",
        "Articulation",
      ]),
      score: z.number(),
      comment: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});




