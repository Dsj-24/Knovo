import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { CoreMessage } from "ai";

// CORS headers are unchanged
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

export async function OPTIONS() {
    return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
    return Response.json(
        { success: true, data: "Thank you!" },
        { status: 200, headers: corsHeaders }
    );
}

export async function POST(request: Request) {
    const { type, topic, difficulty, amount, userId, pdfData, pdfName } = await request.json();

    try {
        let promptContent: CoreMessage[];
        let quizTopic = topic;

        if (pdfData) {
            quizTopic = `Quiz from: ${pdfName}`;

            // --- THIS IS THE CORRECTED SECTION THAT ACTUALLY READS THE PDF ---
            promptContent = [
                {
                    role: 'user',
                    content: [
                        // Part 1: Your text instructions (without the pdfData string)
                        {
                            type: 'text',
                            text: `You are a quiz generation assistant. Your task is to generate ${amount} quiz questions based *solely* on the content of the provided document.
Settings:
- Difficulty: ${difficulty}
- Format: ${type} (must be one of: "true/false", "multiple choice", or "verbal answer")

IMPORTANT RULES:
- Base all questions STRICTLY on the information within the document. Do not use external knowledge.
- ONLY generate questions in the specified format: "${type}".
- Do NOT mix formats. All questions must follow "${type}" strictly.
- Do NOT include answers or explanations.
- Do NOT include extra text before or after the list.
- Do NOT use special characters like "/", "*", or Markdown formatting.

 Format Requirements: 
 - For "multiple choice", each question must embed options like: "What is the capital of France? (A) Berlin (B) Madrid (C) Paris (D) Rome" 
 - For "true/false", format like: "The sky is green. True or False." 
 - For "verbal answer", format like: "Explain the importance of biodiversity in ecosystems." 

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

 Thank you! <3`
                        },
                        // Part 2: The actual PDF file data, sent separately
                        {
                            type: 'image', // The SDK uses 'image' as a generic container for file data
                            image: Buffer.from(pdfData, 'base64'), // Converts Base64 string back to binary data
                            mimeType: 'application/pdf',
                        }
                    ]
                }
            ];
            // --- END OF CORRECTED SECTION ---

        } else {
            // This is the original prompt for topic-based quizzes (this logic is correct)
            promptContent = [
                {
                    role: 'user',
                    content: `You are a quiz generation assistant. 

 Your task is to generate ${amount} quiz questions for a user with the following settings: 
 - Topic: ${topic} 
 - Difficulty: ${difficulty} 
 - Format: ${type} (must be one of: "true/false", "multiple choice", or "verbal answer") 

 IMPORTANT RULES: 
 - ONLY generate questions in the specified format: "${type}" and of no other format mandatorily. 
 - Do NOT mix formats. All questions must follow "${type}" strictly. 
 - Do NOT include answers or explanations. 
 - Do NOT include extra text before or after the list. 
 - Do NOT use special characters like "/", "*", or Markdown formatting. 

 Format Requirements: 
 - For "multiple choice", each question must embed options like: "What is the capital of France? (A) Berlin (B) Madrid (C) Paris (D) Rome" 
 - For "true/false", format like: "The sky is green. True or False" 
 - For "verbal answer", format like: "Explain the importance of biodiversity in ecosystems." If the requested ${type} is "verbal answer", you MUST convert any multiple-choice or true/false questions found in the source material into an open-ended verbal question. For example, if the source contains "Which Agile framework uses Kanban boards? (A) Scrum (B) Kanban", you must rephrase it to something like "Describe the Agile framework that emphasizes the use of Kanban boards." Do NOT output the question in its original multiple-choice or true/false format. 

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

 Thank you! <3`
                }
            ];
        }
        const { text: questions } = await generateText({
            model: google('gemini-1.5-flash-latest'),
            messages: promptContent,
        });

        const cleaned = questions
            .replace(/```json\n?/g, '')
            .replace(/```/g, '')
            .trim();

        const parsedQuestions = JSON.parse(cleaned);

        const quiz = {
            topic: quizTopic,
            type,
            difficulty,
            questions: parsedQuestions,
            userId: userId,
            finalized: true,
            createdAt: new Date().toISOString()
        };

        await db.collection("quizzes").add(quiz);

        return Response.json(
            { success: true },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error("Error generating quiz:", error);
        return Response.json(
            { success: false, error: "Failed to generate quiz. Please check the model output or server logs." },
            { status: 500, headers: corsHeaders }
        );
    }
}