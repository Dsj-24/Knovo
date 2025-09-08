import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

// CORS headers configuration
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Allow all origins, or specify your domain: 'http://localhost:3000'
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: corsHeaders
    });
}

export async function GET() {
    return Response.json(
        { success: true, data: "Thank you!" }, 
        { 
            status: 200,
            headers: corsHeaders
        }
    );
}

export async function POST(request: Request) {
    const { type, topic, difficulty, amount, userid } = await request.json();

    try {
        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `You are a quiz generation assistant.

Your task is to generate ${amount} quiz questions for a user with the following settings:
- Topic: ${topic}
- Difficulty: ${difficulty}
- Format: ${type} (must be one of: "true/false", "multiple choice", or "verbal answer")

IMPORTANT RULES:
- ONLY generate questions in the specified format: "${type}".
- Do NOT mix formats. All questions must follow "${type}" strictly.
- Do NOT include answers or explanations.
- Do NOT include extra text before or after the list.
- Do NOT use special characters like "/", "*", or Markdown formatting.

Format Requirements:
- For "multiple choice", each question must embed options like:
  "What is the capital of France? (A) Berlin (B) Madrid (C) Paris (D) Rome"
- For "true/false", format like:
  "The sky is green. True or False"
- For "verbal answer", format like:
  "Explain the importance of biodiversity in ecosystems."

Final Output Format:
- Output must be a pure JSON array of strings.
Example:
[
  "Question 1",
  "Question 2",
  ...
]

Do not wrap the array in markdown (no \`\`\`json or \`\`\`).
Return ONLY the array and nothing else.

Thank you! <3`,
        });

        const cleaned = questions
            .replace(/```json\n?/g, '')  // Remove ```json or ```json\n
            .replace(/```/g, '')         // Remove closing ```
            .trim();

        const parsedQuestions = JSON.parse(cleaned);

        const quiz = {
            topic,
            type, // e.g., "multiple choice", "true/false", "verbal answer"
            difficulty,
            questions: parsedQuestions,
            userId: userid,
            finalized: true,
            createdAt: new Date().toISOString()
        };

        await db.collection("quizzes").add(quiz);

        return Response.json(
            { success: true }, 
            { 
                status: 200,
                headers: corsHeaders
            }
        );
    } catch (error) {
        console.error("Error:", error);
        return Response.json(
            { success: false, error }, 
            { 
                status: 500,
                headers: corsHeaders
            }
        );
    }
}