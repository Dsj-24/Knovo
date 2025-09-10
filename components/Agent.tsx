"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';
import { QuizMaster } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

// Loading Spinner Component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-6 shadow-2xl border border-gray-100 animate-slideIn">
        <LoadingSpinner />
        
        <div className="text-center">
          <p className="text-gray-700 font-semibold text-lg mb-2">{message}</p>
          
          {/* Animated dots below the message */}
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

const Agent = ({ userName, userId, type, questions, quizId, quizType, feedbackId }: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastMessage, setLastMessage] = useState<string>("");
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);


    useEffect(() => {
        const onCallStart = () => {
            setCallStatus(CallStatus.ACTIVE);
        };

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
        };

        const onMessage = (message: Message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = { role: message.role, content: message.transcript };
                setMessages((prev) => [...prev, newMessage]);
            }
        };
        const onSpeechStart = () => {
            console.log("speech start");
            setIsSpeaking(true);
        };

        const onSpeechEnd = () => {
            console.log("speech end");
            setIsSpeaking(false);
        };

        const onError = (error: Error) => {
            console.log("Error:", error);
        };

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };

    }, [])

useEffect(() => {
        if (messages.length > 0) {
            setLastMessage(messages[messages.length - 1].content);
        }

        const handleGenerateFeedback = async (messages: SavedMessage[]) => {
            console.log("handleGenerateFeedback");
            setIsGeneratingFeedback(true);

            const { success, feedbackId: id } = await createFeedback({
                quizId: quizId!,
                userId: userId!,
                quizType: quizType!,
                transcript: messages,
                feedbackId,
            });

            if (success && id) {
                router.push(`/quiz/${quizId}/feedback`);
            } else {
                console.log("Error saving feedback");
                setIsGeneratingFeedback(false);
                router.push("/");
            }
        };

        if (callStatus === CallStatus.FINISHED) {
            if (type === "generate") {
                router.push("/");
            } else {
                handleGenerateFeedback(messages);
            }
        }
    }, [messages, callStatus, type, userId, quizId, feedbackId, router]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if (type === "generate") {
            await vapi.start(
                undefined,
                undefined,
                undefined,
                process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
                {
                    variableValues: {
                        userName: userName,
                        userId: userId,
                    },
                }
            );
        } else {
            let formattedQuestions = "";
            if (questions && quizType) {
                formattedQuestions = questions
                    .map((question) => `- ${question}`)
                    .join("\n");
            }

            await vapi.start(QuizMaster, {
                variableValues: {
                    questions: formattedQuestions,
                    type: quizType
                },
            });
        }
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };


    return (
        <>

          <LoadingOverlay 
                isLoading={isGeneratingFeedback} 
                message="Generating your personalized feedback..." 
            />

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
                        <h3>{userName}</h3>
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
                                "animate-fadeIn opacity-100 text-2xl"
                            )}
                        >
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className='w-full flex justify-center'>
                {callStatus !== "ACTIVE" ? (
                    <button className="relative btn-call p-4 w-44" onClick={handleCall}>
                        <span
                            className={cn(
                                "absolute animate-ping rounded-full opacity-75",
                                callStatus !== "CONNECTING" && "hidden"
                            )}
                        />

                        <span className="relative text-2xl">
                            {callStatus === "INACTIVE" || callStatus === "FINISHED"
                                ? "Call"
                                : ". . ."}
                        </span>
                    </button>
                ) : (
                    <button className="relative btn-disconnect p-4 w-44 text-2xl" onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div> </>
    )
}

export default Agent