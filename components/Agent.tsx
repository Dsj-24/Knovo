"use client"

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

const Agent = ({ userName }: AgentProps) => {
    const isSpeaking = true;
    const callStatus = CallStatus.INACTIVE; // This would be managed by state in a real application
    const messages = [
  'Whats your name?',
  'My name is John Doe, nice to meet you!'
];

const lastMessage = messages[messages.length - 1];

    return (
        <>

            <div className='call-view mb-12'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src='/robot.png' alt='robot' width={65} height={54} className='object-cover' />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>KNOVO AI</h3>
                </div>
                {/* User Profile Card */}
                <div className="card-border rounded-4xl">
                    <div className="card-content">
                        <Image
                            src="/user.png"
                            alt="profile-image"
                            width={539}
                            height={539}
                            className="rounded-full object-cover size-[120px]"
                        />
                        <h3>{userName}USERNAME</h3>
                    </div>

                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border mb-12 p-1">
                    <div className="transcript">
                        <p
                            key={lastMessage}
                            className={cn(
                                "transition-opacity duration-500 opacity-0",
                                "animate-fadeIn opacity-100 text-xl"
                            )}
                        >
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className='w-full flex justify-center'>
                {callStatus !== "ACTIVE" ? (
                    <button className="relative btn-call p-4 w-44">
                        <span
                            className={cn(
                                "absolute animate-ping rounded-full opacity-75",
                                callStatus !== "CONNECTING" && "hidden"
                            )}
                        />

                        <span className="relative">
                            {callStatus === "INACTIVE" || callStatus === "FINISHED"
                                ? "Call"
                                : ". . ."}
                        </span>
                    </button>
                ) : (
                    <button className="btn-disconnect p-4 w-44">
                        End
                    </button>
                )}
            </div> </>

    )
}

export default Agent