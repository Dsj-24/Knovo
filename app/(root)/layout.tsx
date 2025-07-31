import Link from 'next/link'
import React, { ReactNode } from 'react'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const RootLayout = async ({children}:{children:ReactNode}) => {
             
    const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  
  return (
    <div className='root-layout'> <nav>
       <Link href="/" className='flex items-center gap-2'>
    
    <Image src='/logo.svg' alt="Logo" width={38} height={32} />
    <h2 className='text-primary-100'>KNOVO</h2>
    
    </Link>


      </nav>
        
        
        {children}
                       <div className="mt-6 flex flex-col items-center gap-4 card pt-10 pb-10 px-6">
    <h1 className="text-5xl font-semibold text-primary-100 mb-2">Guidelines & Instructions</h1>
    <ol className="list-decimal list-inside space-y-6 text-muted-foreground text-2xl pl-20">
        <li>Try to give a specific one-worded topic only. Don't write anything random.</li>
        <li>Try to keep the call as short as possible.</li>
        <li>First let the agent finish the question before responding.</li>
        <li>If possible, take the quiz in an isolated environment for better conversation quality. For example, during a short solo work break.</li>
        <li>Don't input more than 7–8 questions for MCQ and True/False, and no more than 2 for Verbal Answer.</li>
    </ol>
</div>
    </div>
  )
}

export default RootLayout