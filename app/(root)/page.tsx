import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { dummyQuizzes } from '../../constants/index';
import QuizCard from '@/components/QuizCard';
import { get } from 'http';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getLatestQuizzes, getQuizzesByUserId, getFeedbackByQuizId } from '@/lib/actions/general.action';
import { Crown, Sparkles, Star, Trophy, Zap } from 'lucide-react';
import LeaderboardCard from '@/components/LeaderboardCard';

//https://knovo-dhlb.vercel.app/quiz/leaderboard
//https://knovo-dhlb.vercel.app/quiz/multiplayer


const Home = async () => {

  const user = await getCurrentUser();
  const [userQuizzes, allQuizzes] = await Promise.all([
    await getQuizzesByUserId(user?.id!),
    await getLatestQuizzes({ userId: user?.id! }),

  ]);


  const hasPastQuizzes = userQuizzes?.length! > 0;
  //@ts-ignore
  const hasUpcomingQuizzes = allQuizzes?.length! > 0;

  return (
    <>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 rounded-3xl mb-12 overflow-hidden shadow-2xl border border-purple-500/20 p-8 sm:p-12 md:p-16 lg:p-20 xl:p-28">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full -translate-y-20 translate-x-20 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/15 to-purple-400/15 rounded-full translate-y-16 -translate-x-16 blur-lg"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl animate-pulse"></div>

        {/* Floating icons */}
        <div className="absolute top-6 right-8 opacity-30 animate-bounce">
          <Star className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="absolute bottom-6 right-12 opacity-25 animate-bounce" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div className="absolute top-8 left-12 opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <Trophy className="w-7 h-7 text-orange-400" />
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Main tagline */}
          <div className="md:space-y-2 md:mt-4 hidden md:block">
            <h1 className="text-2xl md:text-7xl font-black tracking-tight text-center">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Knowledge
              </span>
              <span className="text-white mx-3 font-light">+</span>
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Voice
              </span>
              <span className="text-white mx-3 font-light">=</span>
              <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                KNOVO
              </span>
            </h1>
          </div>

          {/* Subtitle with improved responsive styling */}
          <div className="mx-auto px-4 sm:px-6 md:px-8">
            <p className="text-2xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl 
                     text-gray-300 font-medium leading-relaxed 
                     text-center 
                     tracking-wide sm:tracking-normal
                     py-2 sm:py-3 md:py-4 lg:py-6
                     max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 
                     mx-auto
                     drop-shadow-lg">
              AI-powered voice based Quiz Platform
            </p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 lg:pt-6">
            <div className="h-px w-12 sm:w-16 lg:w-20 bg-gradient-to-r from-transparent to-purple-400"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="h-px w-12 sm:w-16 lg:w-20 bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
        </div>

        {/* Glow effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-indigo-600/5 rounded-3xl"></div>
      </div>

      <h2 className='text-2xl md:text-3xl'>Compete with your Friends and give Adaptive Difficulty Challenges!</h2>

      <LeaderboardCard/>



      <section className="card-cta bg-gradient-to-br from-slate-800 via-purple-950 to-indigo-950 rounded-3xl mb-12 overflow-hidden shadow-2xl border border-purple-500/20">
        <div className="flex flex-col gap-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold">
            Test your Knowledge and Vocal abilities with AI powered Practice & Feedback.
          </h2>
          <p className="text-xl md:text-2xl text-gray-400">
            Practice as many questions on any topic , in any format and any difficulty level and get instant feedback and detailed evaluation.
          </p>

          <Button asChild className="btn-primary max-sm:w-full p-10 text-3xl mt-4">
            <Link href="/quiz">Create Quiz</Link>
          </Button>

        </div>

        <Image src="/robot.png" alt="robot" width={450} height={300} className="max-sm:hidden" />

      </section>


      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Quizzes</h2>


        <div className="interviews-section">
          {
            hasPastQuizzes ? (
              userQuizzes?.map((quiz) => (
                <QuizCard {...quiz} key={quiz.id} viewerId={user?.id} />
              ))
            ) : (
              <p>You haven't taken any quizzes yet</p>
            )
          }

        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">

        <h2>
          Take a Quiz
        </h2>

        <div className='interviews-section'>
          {hasUpcomingQuizzes ? (
            allQuizzes?.map((quiz) => (
              <QuizCard {...quiz} key={quiz.id} viewerId={user?.id} />
            ))
          ) : (
            <p>There are no new quizzes available</p>
          )}
        </div>
      </section>
    </>
  )
}

export default Home