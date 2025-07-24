import React from 'react'
import dayjs from 'dayjs';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';

const QuizCard = ({ id, userId, topic, type, createdAt }: QuizCardProps) => {
    const feedback = null as Feedback|null;
    const normalizedType = /random/gi.test(type) ? "Random" : type;
    const formattedDate = dayjs(
        createdAt || Date.now()
    ).format("MMM D, YYYY");

    return (
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
          <Button className="btn-primary text-lg p-6">
            <Link
              href={
                feedback
                  ? `/interview/${id}/feedback`
                  : `/interview/${id}`
              }
            >
              {feedback ? "Check Feedback" : "Take Quiz"}
            </Link>
          </Button>
        </div>
            </div>
        </div>
    )
}

export default QuizCard