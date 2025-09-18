'use client'
import QuizForm from '@/components/QuizForm'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const QuizPage = () => {
    const [showQuizForm, setShowQuizForm] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        }
        fetchUser()
    }, [])

    if (showQuizForm) {
        return (
            <div>
                <button
                    onClick={() => setShowQuizForm(false)}
                    className="mb-4 px-4 py-2 bg-[#530558] rounded-2xl hover:bg-gray-600 transition-colors"
                >
                    <h2 className='rounded-full text-white font-semibold'>
                        ← Choose
                    </h2>

                </button>
         <div className='flex flex-col items-center justify-center gap-8 p-4'>
                    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 p-1 rounded-3xl shadow-2xl mb-4">
                        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-20 py-6 rounded-3xl">
                            <h2 className='text-center text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent'>
                                QUIZ GENERATION
                            </h2>
                        </div>
                    </div>
                    {user?.id && <QuizForm userId={user.id} />}
                </div>
            </div>
        )
    }

    return (
        <div className='call-view w-full px-4 sm:px-6 flex flex-col md:flex-row gap-8 justify-center items-stretch mb-12 mt-12'>
            {/* Card 1: Form Based Generation - Clickable */}
            <div
                className='card-interviewer rounded-4xl cursor-pointer hover:opacity-80 transition-opacity flex-1 flex flex-col items-center justify-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 border border-purple-500/20'
                onClick={() => setShowQuizForm(true)}
            >
                <Image
                    src='/knovo-form.png'
                    alt='form'
                    width={125}
                    height={105}
                    className='object-contain'
                />
                <h3 className="text-xl font-semibold text-center">Form Based Generation</h3>
            </div>
            {/* Card 2: Voice Based Generation - Link to another page */}
            <Link href={"https://knovo-dhlb.vercel.app/quiz/vic-workflow"} className="flex-1">
                <div className="card-interviewer h-full rounded-4xl cursor-pointer hover:opacity-80 transition-opacity flex-1 flex flex-col items-center justify-center gap-6 p-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20">
                    <Image
                        src="/knovo-vic.png"
                        alt="vic-image"
                        width={125}
                        height={105}
                        className="object-contain"
                    />
                    <h3 className="text-xl font-semibold text-center">Voice Based Generation</h3>
                </div>
            </Link>
        </div>
    )
}
export default QuizPage