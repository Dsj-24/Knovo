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

const Feedback = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();

    const quiz = await getQuizById(id);
    if (!quiz) redirect("/");

    const feedback = await getFeedbackByQuizId({
        quizId: id,
        userId: user?.id!,
    });

    return (
        <section className="section-feedback">
            <div className="flex flex-row justify-center">
                <h1 className="text-4xl font-semibold">
                    Feedback on the Quiz - <span className="capitalize">{quiz.topic}</span> Quiz
                </h1>
            </div>

            <div className="flex flex-row justify-center ">
                <div className="flex flex-row gap-5">
                    {/* Overall Impression */}
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.svg" width={22} height={22} alt="star" />
                        <p>
                            Overall Impression: <span className="text-primary-200 font-bold">{feedback?.totalScore}</span>/100
                        </p>
                    </div>

                    {/* Date */}
                    <div className="flex flex-row gap-2">
                        <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
                        <p>
                            {feedback?.createdAt
                                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            <hr />
            <h2 className="text-2xl font-semibold">Summary & Results:</h2>
            <p className="mt-4">{feedback?.finalAssessment}</p>

            {/* Quiz Breakdown */}
            <div className="flex flex-col gap-6 mt-8">
                <h2 className="text-2xl font-semibold">Breakdown of Your Performance:</h2>
                {feedback?.categoryScores?.map((category, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <div className="flex justify-between">
                            <p className="font-bold">
                                {index + 1}. {category.name} ({category.score} marks)
                            </p>
                            <p className="text-sm text-muted-foreground">/ 100</p>
                        </div>
                        <div className="w-full h-2 bg-muted rounded">
                            <div
                                className="h-full bg-primary rounded"
                                style={{ width: `${category.score}%` }}
                            ></div>
                        </div>
                        <p>{category.comment}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 mt-8">
                <h3 className="text-xl font-semibold">Strengths</h3>
                <ul className="list-disc list-inside text-green-600">
                    {feedback?.strengths?.map((strength, index) => (
                        <li key={index}>{strength}</li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-3 mt-8">
                <h3 className="text-xl font-semibold">Areas for Improvement</h3>
                <ul className="list-disc list-inside text-red-600">
                    {feedback?.areasForImprovement?.map((area, index) => (
                        <li key={index}>{area}</li>
                    ))}
                </ul>
            </div>

            <div className="buttons mt-10 flex gap-4">
                <Button className="btn-secondary flex-1">
                    <Link href="/" className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-primary-200 text-center">
                            Back to dashboard
                        </p>
                    </Link>
                </Button>

                <Button className="btn-primary flex-1">
                    <Link href={`/quiz/${id}`} className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-black text-center">
                            Retake Quiz
                        </p>
                    </Link>
                </Button>
            </div>
        </section>
    );
};

export default Feedback;