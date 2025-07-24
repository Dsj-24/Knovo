import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { dummyQuizzes } from '../../constants/index';
import QuizCard from '@/components/QuizCard';

const Home = () => {
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

<Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Create A Quiz</Link>
</Button>

</div>

<Image src="/robot.png" alt="robot" width={400} height={300} className="max-sm:hidden"/>

   </section>

   <section className="flex flex-col gap-6 mt-8"> 
   <h2>Your Quizes</h2>


   <div className="interviews-section">
 {dummyQuizzes.map((quiz) => (
      <QuizCard {...quiz} key={quiz.id}/>
    ))}
    {/* <p>You haven't taken any interviews yet</p> */}

   </div>
   </section>


   <section className="flex flex-col gap-6 mt-8">

  <h2>
  Take a Quiz 
</h2>

<div className='interviews-section'>
    {/* <p>There are no new interviews available</p>  */}
    {dummyQuizzes.map((quiz) => (
      <QuizCard {...quiz} key={quiz.id}/>
    ))}
</div>
</section>
   </>
  )
}

export default Home