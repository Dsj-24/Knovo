import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
    getFeedbackByQuizId,
    getQuizById,
    getBestFeedbackByUserId
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface QuizResult {
    question: string;
    correctAnswer: string;
    userAnswer: string;
    status: 'Correct' | 'Incorrect' | 'Skipped';
}

const parseAnswerKeyResults = (finalAssessment: string): QuizResult[] => {
    const results: QuizResult[] = [];
    
    console.log("=== PARSING DEBUG ===");
    console.log("Input text:", finalAssessment);
    
    // Try to find anything that looks like quiz results
    // Look for patterns like "Question X:" followed by answers
    const text = finalAssessment.toLowerCase();
    
    if (!text.includes('question') || !text.includes('correct answer')) {
        console.log("No question/answer pattern found");
        return results;
    }
    
    // Split the text into sections that might contain questions
    // Look for "Question" followed by a number
    const questionPattern = /Question\s+(\d+):\s*([^✓]*?)✓?\s*Correct Answer:\s*([^Y]*?)Your Answer:\s*([^-]*?)\s*-\s*(Correct|Incorrect|Skipped)/gi;
    
    let match;
    while ((match = questionPattern.exec(finalAssessment)) !== null) {
        const [, questionNum, questionText, correctAnswer, userAnswer, status] = match;
        
        console.log(`Found question ${questionNum}:`, {
            question: questionText.trim(),
            correct: correctAnswer.trim(),
            user: userAnswer.trim(),
            status: status
        });
        
        results.push({
            question: questionText.trim(),
            correctAnswer: correctAnswer.trim(),
            userAnswer: userAnswer.trim() || 'No response',
            status: status as 'Correct' | 'Incorrect' | 'Skipped'
        });
    }
    
    // If the regex didn't work, try a simpler line-by-line approach
    if (results.length === 0) {
        console.log("Regex failed, trying line-by-line parsing");
        const lines = finalAssessment.split('\n');
        let currentQuestion = '';
        let correctAnswer = '';
        let userAnswer = '';
        let status: 'Correct' | 'Incorrect' | 'Skipped' = 'Skipped';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            console.log(`Line ${i}:`, line);
            
            if (/Question\s+\d+:/i.test(line)) {
                // Save previous question if complete
                if (currentQuestion && correctAnswer) {
                    results.push({
                        question: currentQuestion,
                        correctAnswer: correctAnswer,
                        userAnswer: userAnswer || 'No response',
                        status: status
                    });
                }
                
                // Start new question
                currentQuestion = line.replace(/Question\s+\d+:\s*/i, '').trim();
                correctAnswer = '';
                userAnswer = '';
                status = 'Skipped';
                console.log("New question:", currentQuestion);
            } else if (line.includes('Correct Answer:')) {
                correctAnswer = line.replace(/.*Correct Answer:\s*/i, '').trim();
                console.log("Correct answer:", correctAnswer);
            } else if (line.includes('Your Answer:')) {
                const answerMatch = line.match(/Your Answer:\s*(.+?)\s*-\s*(Correct|Incorrect|Skipped)/i);
                if (answerMatch) {
                    userAnswer = answerMatch[1].trim();
                    status = answerMatch[2] as 'Correct' | 'Incorrect' | 'Skipped';
                    console.log("User answer:", userAnswer, "Status:", status);
                }
            }
        }
        
        // Don't forget the last question
        if (currentQuestion && correctAnswer) {
            results.push({
                question: currentQuestion,
                correctAnswer: correctAnswer,
                userAnswer: userAnswer || 'No response',
                status: status
            });
        }
    }
    
    console.log("Final results:", results);
    console.log("=== END PARSING DEBUG ===");
    return results;
};

const QuizResultsTable = ({ results }: { results: QuizResult[] }) => {
    if (results.length === 0) return null;

    return (
        <div className="mt-6 sm:mt-8">
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl sm:rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden">
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-purple-800/80 to-indigo-800/80 p-4 sm:p-6 border-b border-purple-500/30">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
                                Quiz Results
                            </h2>
                            <p className="text-purple-300 text-xs sm:text-sm mt-1">Detailed breakdown of your performance</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-purple-500/20">
                        <thead className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-purple-200 uppercase tracking-wider border-r border-purple-500/20">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="hidden sm:inline">Question</span>
                                        <span className="sm:hidden">Q</span>
                                    </div>
                                </th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-purple-200 uppercase tracking-wider border-r border-purple-500/20">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="hidden sm:inline">Your Answer</span>
                                        <span className="sm:hidden">Your</span>
                                    </div>
                                </th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-purple-200 uppercase tracking-wider border-r border-purple-500/20">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="hidden sm:inline">Correct Answer</span>
                                        <span className="sm:hidden">Correct</span>
                                    </div>
                                </th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-purple-200 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span className="hidden sm:inline">Result</span>
                                        <span className="sm:hidden">Status</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-gradient-to-br from-purple-950/50 to-indigo-950/50 divide-y divide-purple-500/10">
                            {results.map((result, index) => (
                                <tr key={index} className={`transition-colors duration-200 hover:bg-purple-800/20 ${
                                    index % 2 === 0 
                                        ? 'bg-purple-900/20' 
                                        : 'bg-indigo-900/20'
                                }`}>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-purple-100 max-w-xs sm:max-w-md border-r border-purple-500/10">
                                        <div className="break-words leading-relaxed">{result.question}</div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm border-r border-purple-500/10">
                                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-semibold border ${
                                            result.status === 'Correct' 
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                                : result.status === 'Incorrect'
                                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                                : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
                                        }`}>
                                            {result.userAnswer}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-purple-200 border-r border-purple-500/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
                                            {result.correctAnswer}
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-bold border-2 ${
                                            result.status === 'Correct' 
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60' 
                                                : result.status === 'Incorrect'
                                                ? 'bg-red-500/20 text-red-300 border-red-500/60'
                                                : 'bg-gray-500/20 text-gray-300 border-gray-500/60'
                                        }`}>
                                            <span className="mr-1 sm:mr-1.5">
                                                {result.status === 'Correct' && '✓'}
                                                {result.status === 'Incorrect' && '✗'}
                                                {result.status === 'Skipped' && '○'}
                                            </span>
                                            <span className="hidden sm:inline">{result.status}</span>
                                            <span className="sm:hidden">
                                                {result.status === 'Correct' && 'OK'}
                                                {result.status === 'Incorrect' && 'NO'}
                                                {result.status === 'Skipped' && '--'}
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Feedback = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();

    const quiz = await getQuizById(id);
    if (!quiz) redirect("/");

    const feedback = await getFeedbackByQuizId({
        quizId: id,
        userId: user?.id!,
    });

    // Always try to parse - remove quiz type restriction for debugging
    const quizResults = feedback?.finalAssessment
        ? parseAnswerKeyResults(feedback.finalAssessment)
        : [];

    console.log("Final quiz results length:", quizResults.length);
    console.log("=== END DEBUG ===");

    // Filter out Answer Key & Results from finalAssessment for display
    const filteredAssessment = feedback?.finalAssessment
        ? feedback.finalAssessment.replace(/Answer Key & Results\s*:[\s\S]*$/, '').trim()
        : '';

    return (
        <section className="section-feedback px-4 sm:px-6 lg:px-8">
            <div className="flex flex-row justify-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center">
                    Feedback on the Quiz - <span className="capitalize">{quiz.topic}</span> Quiz
                </h1>
            </div>

            <div className="flex flex-row justify-center">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-center">
                    {/* Overall Impression */}
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.svg" width={20} height={20} alt="star" className="sm:w-[22px] sm:h-[22px]" />
                        <p className="text-sm sm:text-base">
                            Overall Impression: <span className="text-primary-200 font-bold">{feedback?.totalScore}</span>/100
                        </p>
                    </div>

                    {/* Date */}
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/calendar.svg" width={20} height={20} alt="calendar" className="sm:w-[22px] sm:h-[22px]" />
                        <p className="text-sm sm:text-base">
                            {feedback?.createdAt
                                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            <hr />

            {/* Show table for MCQ and True/False, show summary for Verbal Answer */}
            {quizResults.length > 0 ? (
                <QuizResultsTable results={quizResults} />
            ) : (
                <>
                    <h2 className="text-xl sm:text-2xl font-semibold">Summary & Results:</h2>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed">{filteredAssessment || feedback?.finalAssessment}</p>
                </>
            )}

            {/* Quiz Breakdown */}
            <div className="flex flex-col gap-4 sm:gap-6 mt-6 sm:mt-8">
                <h2 className="text-xl sm:text-2xl font-semibold">Breakdown of Your Performance:</h2>
                {feedback?.categoryScores?.map((category, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <div className="flex justify-between">
                            <p className="font-bold text-sm sm:text-base">
                                {index + 1}. {category.name} ({category.score} marks)
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">/ 100</p>
                        </div>
                        <div className="w-full h-2 bg-muted rounded">
                            <div
                                className="h-full bg-primary rounded"
                                style={{ width: `${category.score}%` }}
                            ></div>
                        </div>
                        <p className="text-sm sm:text-base">{category.comment}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-xl font-semibold">Strengths</h3>
                <ul className="list-disc list-inside text-green-600 text-sm sm:text-base">
                    {feedback?.strengths?.map((strength, index) => (
                        <li key={index}>{strength}</li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-xl font-semibold">Areas for Improvement</h3>
                <ul className="list-disc list-inside text-red-600 text-sm sm:text-base">
                    {feedback?.areasForImprovement?.map((area, index) => (
                        <li key={index}>{area}</li>
                    ))}
                </ul>
            </div>

            <div className="buttons mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
                <Button className="btn-secondary w-full sm:flex-1 max-w-xs sm:max-w-none">
                    <Link href="/" className="flex w-full justify-center">
                        <p className="text-xs sm:text-sm font-semibold text-primary-200 text-center">
                            Back to dashboard
                        </p>
                    </Link>
                </Button>

                <Button className="btn-primary w-full sm:flex-1 max-w-xs sm:max-w-none">
                    <Link href={`/quiz/${id}`} className="flex w-full justify-center">
                        <p className="text-xs sm:text-sm font-semibold text-black text-center">
                            Retake Quiz
                        </p>
                    </Link>
                </Button>
            </div>
        </section>
    );
};

export default Feedback;