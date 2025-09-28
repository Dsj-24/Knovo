'use client'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { getBestFeedbackByUserId } from '@/lib/actions/general.action';

const LoadingSpinner = () => (
  <div className="relative flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
    <div className="absolute animate-pulse rounded-full h-2 w-2 bg-blue-600"></div>
  </div>
)

const LoadingOverlay = ({ isLoading, message }: { isLoading: boolean; message: string }) => {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-6 shadow-2xl border border-gray-100 animate-slideIn">
        <LoadingSpinner />
        <div className="text-center">
          <p className="text-gray-700 font-semibold text-lg mb-2">{message}</p>
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

interface Feedback { totalScore: number; }

const QuizCard = ({ id, viewerId, userId, topic, type, createdAt }: QuizCardProps) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!viewerId || !id) {
        setIsFetching(false);
        return;
      }
      try {
        const result = await getBestFeedbackByUserId({ userId: viewerId, quizId: id });
        setFeedback(result);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
        setFeedback(null);
      } finally {
        setIsFetching(false);
      }
    };
    fetchFeedback();
  }, [id, viewerId]);

  const normalizedType = /random/gi.test(type) ? "Random" : type;
  const formattedDate = dayjs(createdAt || Date.now()).format("MMM D, YYYY");
  const [isLoading, setIsLoading] = useState(false);

  const palette = (() => {
    const t = (type || '').toLowerCase();
    if (t.includes('multiple')) {
      return {
        wrap: 'from-blue-500 via-blue-600 to-cyan-600',
        chip: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        inner: 'bg-blue-900/40 border-blue-400/20',
        stat: 'text-blue-100',
      };
    }
    if (t.includes('true') || t.includes('false')) {
      return {
        wrap: 'from-green-500 via-green-600 to-emerald-600',
        chip: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
        inner: 'bg-emerald-900/35 border-emerald-400/20',
        stat: 'text-emerald-100',
      };
    }

    return {
      wrap: 'from-orange-500 via-red-500 to-pink-600',
      chip: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      inner: 'bg-orange-900/35 border-orange-300/20',
      stat: 'text-orange-100',
    };
  })();

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="Loading Quiz / Feedback ..." />

      {/* Outer card keeps your existing layout but gets a soft gradient frame by type */}
      <div className="w-[360px] max-sm:w-full min-h-96 mb-4 mr-4">
        <div className={`relative rounded-2xl p-[1px] bg-gradient-to-br h-full ${palette.wrap}`}>
          <div className={`card-border rounded-2xl bg-[#0B0B12] min-w-full h-full ${palette.wrap}`}>
            <div className="card-interview">

              {/* Type chip (kept in same place) */}
              <div className="absolute top-0 right-0 w-fit rounded-b-lg">
                <div className={`rounded-sm px-3 py-2.5 text-sm font-semibold shadow ${palette.chip}`}>
                  {normalizedType}
                </div>
              </div>

              <div>
                <h2 className="mt-5 capitalize font-bold">{topic} Quiz</h2>

                <div className={`flex flex-row gap-5 mt-3 ${palette.stat}`}>
                  <div className="flex flex-row gap-2 items-center">
                    <Image src="/calendar.svg" width={22} height={20} alt="calendar" />
                    <p>{formattedDate}</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <Image src="/star.svg" width={22} height={22} alt="star" />
                    <p>
                      {isFetching ? "..." : `${feedback?.totalScore?.toFixed(0) || "---"}`}/100
                    </p>
                  </div>
                </div>

                {/* info block with subtle type background */}
                <p className={`mt-5 text-xl text-light-100 rounded-lg border px-4 py-3 ${palette.inner}`}>
                  {isFetching
                    ? "Checking your attempts..."
                    : feedback
                      ? "You have already taken this quiz. You can check your feedback."
                      : "You haven't taken this quiz."
                  }
                </p>
              </div>

              <div className="flex flex-row justify-between pt-10">
                <Button asChild className="btn-primary text-lg p-6" >
                  <Link onClick={() => setIsLoading(true)} href={feedback ? `/quiz/${id}/feedback` : `/quiz/${id}`}>
                    {feedback ? "Check Feedback" : "Take Quiz"}
                  </Link>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default QuizCard;
