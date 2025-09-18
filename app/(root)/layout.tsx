import Link from 'next/link'
import React, { ReactNode } from 'react'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const RootLayout = async ({ children }: { children: ReactNode }) => {

  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");


  return (
    <>
   
    <div className='root-layout'> <nav>
      <Link href="/" className='flex items-center gap-2'>

        <Image src='/logo.svg' alt="Logo" width={38} height={32} />
        <span className="bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-600 bg-clip-text text-transparent text-5xl font-semibold">
          KNOVO
        </span>
      </Link>


    </nav>


      {children}
      <div className="mt-6 flex flex-col items-center gap-4 card pt-10 pb-10 px-6 bg-gradient-to-br from-slate-800 via-purple-950 to-indigo-950 rounded-3xl mb-12 overflow-hidden shadow-2xl border border-purple-500/20">
        <h1 className="text-5xl font-semibold text-primary-100 mb-2">Guidelines & Instructions</h1>
        <ol className="list-decimal list-inside space-y-6 text-muted-foreground text-2xl pl-20">
          <li>Try to give a specific one-worded topic only. Don't write anything lengthy or random.</li>
          <li>Try to keep the call as short as possible as it will cost credits.</li>
          <li>Let the agent finish the question before responding.</li>
          <li>We recommend you to take the quiz in an isolated environment for better conversation quality. For eg: during a short solo work break.</li>
          <li>Don't input more than 9-10 questions for MCQ and True/False, and no more than 3 for Verbal Answer.</li>
          <li>The voice agent is sensitive to background noise, so please ensure a quiet environment as noise will cause disruption in the quiz flow.</li>
          <li>Before pressing the end button in any kind of call, make sure to receive confirmation from the agent.</li>
          <li>For visually impaired persons, we recommend choosing voice based generation.</li>
        </ol>
      </div>
    </div>

 {/* Full Width Footer */}
      <footer className="w-full bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 border-t border-purple-500/30">
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-8 lg:py-12 max-w-none">
          {/* Team Section - Left */}
          <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-6">
              The Immortals
            </h2>
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-3">
              <span className="text-gray-300 text-lg lg:text-xl font-medium hover:text-purple-400 transition-colors">Divesh</span>
              <span className="text-gray-300 text-lg lg:text-xl font-medium hover:text-purple-400 transition-colors">Anmol</span>
              <span className="text-gray-300 text-lg lg:text-xl font-medium hover:text-purple-400 transition-colors">Adyant</span>
              <span className="text-gray-300 text-lg lg:text-xl font-medium hover:text-purple-400 transition-colors">Alok</span>
              <span className="text-gray-300 text-lg lg:text-xl font-medium hover:text-purple-400 transition-colors">Tathagat</span>
            </div>
          </div>

          {/* Theme Section - Middle */}
          <div className="flex-1 text-center mb-8 lg:mb-0">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 lg:p-8 backdrop-blur-sm border border-purple-500/30">
              <h3 className="text-2xl lg:text-4xl font-bold text-white mb-2">Theme</h3>
              <p className="text-3xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Multimodal AI
              </p>
            </div>
          </div>

          {/* Samsung Prism Image - Right */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              <Image
                src="/prism_logo.png"
                alt="Samsung Prism"
                width={200}
                height={200}
              />
           
            </div>
          </div>
        </div>


      </footer>
    
    
    
     </>
  )
}

export default RootLayout