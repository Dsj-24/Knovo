import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { dummyQuizzes } from '../../constants/index';
import QuizCard from '@/components/QuizCard';
import { get } from 'http';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getLatestQuizzes, getQuizzesByUserId , getFeedbackByQuizId } from '@/lib/actions/general.action';

const Home = async () => {

const user= await getCurrentUser();
const [userQuizzes,  allQuizzes ] = await Promise.all([
  await getQuizzesByUserId(user?.id!),
  await getLatestQuizzes({ userId: user?.id! }),

]);
  

  const hasPastQuizzes = userQuizzes?.length! > 0;
  //@ts-ignore
  const hasUpcomingQuizzes = allQuizzes?.length! > 0;

  return (
    <>
 <section  className="card-cta">
<div className="flex flex-col gap-6 max-w-lg">
<h2>
Test your knowledge with AI powered Practice & Feedback.
</h2>
<p className="text-lg">
Practice any type of questions and get instant feedback on Knowledge and Vocal abilities.
</p>

<Button asChild className="btn-primary max-sm:w-full p-6 text-xl mt-2">
            <Link href="/quiz">Create A Quiz</Link>
</Button>

</div>

<Image src="/robot.png" alt="robot" width={400} height={300} className="max-sm:hidden"/>

   </section>

   <section className="flex flex-col gap-6 mt-8"> 
   <h2>Your Quizzes</h2>


   <div className="interviews-section">
{
  hasPastQuizzes ? (
    userQuizzes?.map((quiz) => (
      <QuizCard {...quiz} key={quiz.id} />
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
    <QuizCard {...quiz} key={quiz.id}/>
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