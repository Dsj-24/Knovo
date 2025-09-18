import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByQuizId, getQuizById } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import Agent from '@/components/Agent';

const QuizPage = async ({ params }: RouteParams) => {
    const { id } = await params;
    const quiz = await getQuizById(id);
    const user = await getCurrentUser();
    
    if (!quiz) redirect('/');
    
    const feedback = await getFeedbackByQuizId({
        quizId: id,
        userId: user?.id!,
    });

    return (
        
            
            <div>
                
                {/* Header Section with Quiz Info */}
                <div className="flex flex-row gap-6 justify-between items-center mb-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-2xl border border-purple-500/20">
                    <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                        <div className="flex flex-row gap-4 items-center">
                            {/* Uncomment if you want to add logo */}
                            {/* <Image
                                src="./logo.svg"
                                alt="cover-image"
                                width={40}
                                height={40}
                                className="rounded-full object-cover size-[40px]"
                            /> */}
                            <div className="relative">
                                <h2 className="capitalize text-3xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                                    {quiz.topic} Quiz
                                </h2>
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-60"></div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                        <div className="relative bg-gradient-to-r from-purple-800 to-blue-700 px-6 py-3 rounded-xl border border-purple-400/30 shadow-lg">
                            <p className="text-white text-2xl font-semibold tracking-wide uppercase">
                                {quiz.type}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Agent Component with reduced margins */}
                <div className="bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-2xl p-4 border border-purple-500/20">
                    <Agent
                        userName={user?.name!}
                        userId={user?.id}
                        quizId={id}
                        type="quiz"
                        quizType={quiz.type}
                        questions={quiz.questions}
                        feedbackId={feedback?.id}
                    />
                </div>
            </div>
    )
}

export default QuizPage