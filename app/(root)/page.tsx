import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { dummyQuizzes } from '../../constants/index';
import QuizCard from '@/components/QuizCard';
import { get } from 'http';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getLatestQuizzes, getQuizzesByUserId, getFeedbackByQuizId } from '@/lib/actions/general.action';
import { Crown, Sparkles, Star, Trophy, Zap } from 'lucide-react';

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
      <div className="relative bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 rounded-3xl mb-12 overflow-hidden shadow-2xl border border-purple-500/20 p-28">
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
        <div className="relative z-10 space-y-6">
          {/* Main tagline */}
          <div className="md:space-y-2 md:mt-4 hidden md:block">
            <h1 className="text-2xl md:text-6xl font-black tracking-tight text-center">
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
          
          {/* Subtitle */}
          <div className="max-w-2xl mx-auto">
            <p className="text-2xl md:text-xl text-gray-300 font-medium leading-relaxed text-center">
              Create personalised oral quizzes and compete with friends
            </p>
          </div>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
        </div>
        
        {/* Glow effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-indigo-600/5 rounded-3xl"></div>
      </div>

      <h2>Compete with your Friends and give Adaptive Difficulty Challenges!</h2>

      <div className='grid grid-cols-2 gap-8 max-sm:grid-cols-1 mb-8'>

        <Link href="https://knovo-dhlb.vercel.app/leaderboard">
          {/* Leaderboards Box */}
          <div className='relative bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-600 rounded-2xl p-12 text-white flex flex-col items-center justify-center gap-4 text-center overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer shadow-2xl border border-purple-400/30'>
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:rotate-180 transition-transform duration-700"></div>
            
            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <Trophy className="w-12 h-12 text-yellow-300 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                Leaderboards
              </h3>
              <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                
              </div>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
          </div>
  </Link>
          <Link href="https://knovo-dhlb.vercel.app/multiplayer">
          {/* Buzz Rush Box */}
          <div className='relative bg-gradient-to-tr from-yellow-400 via-orange-400 to-orange-500 rounded-2xl p-12 text-white flex flex-col items-center justify-center gap-4 text-center overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer shadow-2xl border border-yellow-400/30'>
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-500"></div>
            <div className="absolute bottom-0 right-0 w-18 h-18 bg-white/15 rounded-full translate-y-9 translate-x-9 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-white/5 rounded-full group-hover:-rotate-45 transition-transform duration-700"></div>
            
            {/* Lightning bolts decoration */}
            <div className="absolute top-4 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
              <Zap className="w-6 h-6 text-white rotate-12" />
            </div>
            <div className="absolute bottom-6 left-4 opacity-15 group-hover:opacity-30 transition-opacity duration-300">
              <Zap className="w-8 h-8 text-white -rotate-12" />
            </div>
            
            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 scale-150"></div>
                <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-full p-3 border border-white/30">
                  <Zap className="w-10 h-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300 fill-current" />
                </div>
                <Sparkles className="w-5 h-5 text-white/80 absolute -top-1 -right-1 z-10 group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                Challenge Mode
              </h3>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-300 via-orange-300 to-red-400 opacity-0 group-hover:opacity-40 transition-opacity duration-300 animate-pulse"></div>
          </div>
          </Link>
        </div>

      <section className="card-cta bg-gradient-to-br from-slate-800 via-purple-950 to-indigo-950 rounded-3xl mb-12 overflow-hidden shadow-2xl border border-purple-500/20">
        <div className="flex flex-col gap-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold">
            Test your knowledge and vocal abilities with AI powered Practice & Feedback.
          </h2>
          <p className="text-2xl">
            Practice as many questions on any topic , any format , any difficulty level and get instant feedback on knowledge and vocal abilities.
          </p>

          <Button asChild className="btn-primary max-sm:w-full p-10 text-3xl mt-4">
            <Link href="/quiz">Create A Quiz</Link>
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