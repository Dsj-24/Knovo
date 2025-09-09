'use client'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { getBestFeedbackByUserId } from '@/lib/actions/general.action'; // Your async function

// --- Loading Components (no changes) ---
const LoadingSpinner = () => (
  <div className="relative flex items-center justify-center">
    {/* Outer rotating ring with gradient effect */}
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>

    {/* Inner pulsing dot for extra visual appeal */}
    <div className="absolute animate-pulse rounded-full h-2 w-2 bg-blue-600"></div>
  </div>
)

// Enhanced Loading Overlay with smoother animations
const LoadingOverlay = ({ isLoading, message }: { isLoading: boolean; message: string }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-6 shadow-2xl border border-gray-100 animate-slideIn">
        <LoadingSpinner />
        
        <div className="text-center">
          <p className="text-gray-700 font-semibold text-lg mb-2">{message}</p>
          
          {/* Animated dots below the message */}
          <div className="flex justify-center space-x-1">
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  )
}



interface Feedback {
    totalScore: number;
}

const QuizCard = ({ id, userId, topic, type, createdAt }: QuizCardProps) => {
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            if (!userId || !id) {
                setIsFetching(false);
                return;
            }
            try {
                const result = await getBestFeedbackByUserId({ userId: userId, quizId: id });
                setFeedback(result);
            } catch (error) {
                console.error("Failed to fetch feedback:", error);
                setFeedback(null);
            } finally {
                setIsFetching(false);
            }
        };

        fetchFeedback();
    }, [id, userId]);

    const normalizedType = /random/gi.test(type) ? "Random" : type;
    const formattedDate = dayjs(createdAt || Date.now()).format("MMM D, YYYY");
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <LoadingOverlay isLoading={isLoading} message="Loading Quiz / Feedback ..." />
            <div className="card-border w-[360px] max-sm:w-full min-h-96">
                <div className="card-interview">
                    <div>
                        <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                            <p className="badge-text">{normalizedType}</p>
                        </div>
                        <h2 className="mt-5 capitalize font-bold">{topic} Quiz</h2>
                        <div className="flex flex-row gap-5 mt-3">
                            <div className="flex flex-row gap-2 items-center">
                                <Image src="/calendar.svg" width={22} height={20} alt="calendar" />
                                <p>{formattedDate}</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <Image src="/star.svg" width={22} height={22} alt="star" />
                                <p>
                                    {isFetching
                                        ? "..."
                                        : `${feedback?.totalScore?.toFixed(0) || "---"}`
                                    }/100
                                </p>
                            </div>
                        </div>

                        {/* --- NEW CONDITIONAL MESSAGE BLOCK --- */}
                        <p className="mt-5 text-xl text-light-100">
                            {isFetching
                                ? "Checking your attempts..."
                                : feedback
                                    ? "You have already taken this quiz. You can check your feedback."
                                    : "You haven't taken this quiz."
                            }
                        </p>
                        
                    </div>
                    <div className="flex flex-row justify-between pt-10">
                        <Button className="btn-primary text-lg p-6" onClick={() => setIsLoading(true)}>
                            <Link
                                href={
                                    feedback
                                        ? `/quiz/${id}/feedback`
                                        : `/quiz/${id}`
                                }
                            >
                                {feedback ? "Check Feedback" : "Take Quiz"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuizCard;