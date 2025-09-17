type FormType = "sign-in" | "sign-up";

interface QuizCardProps {
  id?: string;
  viewerId?: string; 
  userId?: string;
  topic: string;
  type: string;
  createdAt?: string;
}

interface Quiz {
  id: string;
  topic: string;
  difficulty: string;
  questions: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

interface Feedback {
  id: string;
  quizId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface AgentProps{
  userName?: string;
  userId?: string;
  quizId?: string;
  feedbackId?: string;
  type: "generate" | "quiz";
  quizType?: "true/false" | "multiple choice" | "verbal answer" | string ;
  questions?: string[];
}

interface GetFeedbackByQuizIdParams {
  quizId: string;
  userId: string;
}

interface GetLatestQuizzesParams {
  userId: string;
  limit?: number;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface Feedback {
  id: string;
  quizId: string;
  userId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}


interface CreateFeedbackParams {
  quizId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
  quizType?: "true/false" | "multiple choice" | "verbal answer" | string;
}

interface GetFeedbackByQuizIdParams {
  quizId: string;
  userId: string;
}

interface GetLatestQuizzesParams {
  userId: string;
  limit?: number;
}

interface QuizWithTop {
  quizId: string;
  topic: string;
  type: string;
  topScorers: { name: string; score: number; userId: string }[];
}

interface User {
  name: string;
  email: string;
}
