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
    const { type, topic, difficulty, questions, amount, userId } = await request.json();

    try {
        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a quiz with the following parameters:
            The topic of the quiz is : ${topic}
            The Difficulty Level is  : ${difficulty}
            The Format of the Quiz is : ${type} (can be "true/false", "multiple choice", or "verbal answer")
            The amount of questions required is : ${amount}

            Please follow these rules:
            - Please return only the questions , without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            - If it's a multiple-choice question, embed the options directly in the question like this:
            "What is the capital of France? (A) Berlin (B) Madrid (C) Paris (D) Rome"
            - If it's a true/false question, format it like this:
            "Is Python a compiled language? True or False"
            - If it's a verbal answer question, format it like this:
            "Explain the concept of gravity in simple terms."
            - Do NOT return the correct answers.
            - Do NOT include any explanations or extra content.
            - Format your output strictly as a JSON array:
            ["Question 1", "Question 2", "Question 3"]
                        
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
            userId: userId,
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