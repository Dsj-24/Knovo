import { getCurrentUser } from '@/lib/actions/auth.action';
import { getQuizById } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import Agent from '@/components/Agent';
const QuizPage = async ({ params }: RouteParams) => {
    const { id } = await params;
    const quiz = await getQuizById(id);
    const user = await getCurrentUser();
    if (!quiz) redirect('/')

    return (
        <>
            <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                    <div className="flex flex-row gap-4 items-center">
                        {/* <Image
                            src="./logo.svg"
                            alt="cover-image"
                            width={40}
                            height={40}
                            className="rounded-full object-cover size-[40px]"
                        /> */}
                        <h2 className="capitalize">{quiz.topic} Quiz</h2>
                    </div>

                </div>

                <p className="bg-gray-800 px-4 py-2 rounded-xl h-fit text-4xl">
                    {quiz.type}
                </p>
            </div>

            <Agent
                userName={user?.name!}
                userId={user?.id}
                quizId={id}
                type="quiz"
                quizType={quiz.type}
                questions={quiz.questions}
            // feedbackId={feedback?.id}
            /></>
    )
}

export default QuizPage