"use client"
import { Trophy, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react'


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


const LeaderboardCard = () => {

     const [isLoading, setIsLoading] = useState(false);
     const [isLoading2, setIsLoading2] = useState(false);


  return (
    <>
          <div className='grid grid-cols-2 gap-8 max-sm:grid-cols-1 mb-8'>
            <LoadingOverlay isLoading={isLoading} message="Loading Leaderboard..." />
            <LoadingOverlay isLoading={isLoading2} message="Loading Challenge Mode..." />

        <Link href="https://knovo-dhlb.vercel.app/leaderboard" onClick={() => setIsLoading(true)}>
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
        <Link href="https://knovo-dhlb.vercel.app/multiplayer" onClick={() => setIsLoading2(true)}>
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
    </>
  )
}

export default LeaderboardCard

