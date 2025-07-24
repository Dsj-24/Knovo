type FormType = "sign-in" | "sign-up";

interface QuizCardProps {
  id?: string;
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