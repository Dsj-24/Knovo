'use client'
import React, { useState } from 'react'
import dayjs from 'dayjs';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
)

// Loading Overlay Component
const LoadingOverlay = ({ isLoading, message }: { isLoading: boolean; message: string }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
        <LoadingSpinner />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  )
}

const QuizCard = ({ id, userId, topic, type, createdAt }: QuizCardProps) => {
    const feedback = null as Feedback|null;
    const normalizedType = /random/gi.test(type) ? "Random" : type;
    const formattedDate = dayjs(
        createdAt || Date.now()
    ).format("MMM D, YYYY");
    const [isLoading, setIsLoading] = useState(false);

    return (
      <>

      <LoadingOverlay isLoading={isLoading} message="Loading Quiz..." />

        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview">
                <div>
                    <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                        <p className="badge-text">{normalizedType}</p>
                    </div>
                    {/* Quiz Topic */}
                    <h2 className="mt-5 capitalize font-bold">{topic} Quiz</h2>

                    {/* Date & Score */}
                    <div className="flex flex-row gap-5 mt-3">
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                src="/calendar.svg"
                                width={22}
                                height={20}
                                alt="calendar"
                            />
                            <p>{formattedDate}</p>
                        </div>
                          <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
                    </div>
                {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5 text-xl">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
                </div>
            <div className="flex flex-row justify-between">
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
        </div></>
    )
}

export default QuizCard