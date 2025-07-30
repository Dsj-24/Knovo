import Agent from '@/components/Agent'
import QuizForm from '@/components/QuizForm'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const QuizPage = async () => {
  const user = await getCurrentUser()

  return (
    <div className='flex flex-col items-center justify-center gap-8 p-4'>
      <h2 className='text-center mb-8'>QUIZ GENERATION</h2>
      <QuizForm userId={user?.id!} />
    
    </div>
    
  )
}

export default QuizPage