import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const QuizPage = async () => {
  const user = await getCurrentUser()

  return (
    <div>
      <h2 className='text-center mb-8'>Quiz Generation</h2>
        <Agent  userName={user?.name} userId={user?.id} type="generate" />
    </div>
    
  )
}

export default QuizPage