"use client";

import React, { useEffect, useRef, useState } from "react";
import { vapi } from "@/lib/vapi.sdk"; // Assuming you have your Vapi SDK wrapper here
import { Star, Sparkles, Trophy, Zap, Play, ArrowRight, Mic, MicOff } from "lucide-react";
import Image from "next/image";

export default function KnovoLandingPage() {
  const [running, setRunning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role?: string; text: string }[]>([]);
  const msgIdRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Ensure this environment variable points to your demo workflow ID
  const workflowId = process.env.NEXT_PUBLIC_DEMO_WORKFLOW_ID!;

  // Register real Vapi event handlers
  useEffect(() => {
    const onCallStart = () => {
      setRunning(true);
      setStarting(false); // Call has started, so it's no longer "starting"
      setCallEnded(false);
      console.log("[vapi] call-start");
    };
    
    const onCallEnd = () => {
      setRunning(false);
      setCallEnded(true);
      console.log("[vapi] call-end");
    };
    
    const onMessage = (msg: any) => {
      const text =
        msg?.type === "transcript"
          ? msg.transcript
          : msg?.text ?? msg?.content ?? "";

      const role = msg?.role ?? (msg?.from ?? "assistant");

      if (!text) return;
      if (msg?.type === "transcript" && msg?.transcriptType && msg.transcriptType !== "final") {
        return;
      }

      const id = `m-${++msgIdRef.current}-${Date.now()}`;
      setMessages((prev) => [...prev, { id, role, text }]);
    };
    
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (err: any) => {
      console.error("[vapi] error", err);
      setStarting(false);
      setRunning(false);
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
  }, []);

  // Start the workflow
  const handleStart = async () => {
    if (!workflowId) {
      alert("Missing NEXT_PUBLIC_DEMO_WORKFLOW_ID in .env.local");
      return;
    }
    setStarting(true);
    setMessages([]);
    setCallEnded(false);
    
    try {
      const variableValues = {
        userName: "Guest",
        userId: null,
      };

      await vapi.start(undefined, undefined, undefined, workflowId, { variableValues });
    } catch (err: any) {
      console.error("Failed to start workflow", err);
      alert("Failed to start workflow. See console.");
      setStarting(false); // Reset on failure
    }
  };

  const handleSignIn = () => {
    window.location.href = '/sign-in';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full -translate-y-36 translate-x-36 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/15 to-purple-400/15 rounded-full translate-y-32 -translate-x-32 blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-8 right-12 opacity-30 animate-bounce">
        <Star className="w-8 h-8 text-yellow-400" />
      </div>
      <div className="absolute bottom-12 right-16 opacity-25 animate-bounce" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-6 h-6 text-purple-400" />
      </div>
      <div className="absolute top-12 left-16 opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <Trophy className="w-9 h-9 text-orange-400" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header - Knowledge + Voice = KNOVO */}
        <div className="text-center mb-8 md:mb-12 mt-8">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
              <span className="inline-block">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                  Knowledge
                </span>
                <span className="text-white mx-2 md:mx-4 font-light text-3xl md:text-6xl">+</span>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-pulse" style={{ animationDelay: '0.5s' }}>
                  Voice
                </span>
              </span>
              <span className="block sm:inline-block">
                <span className="text-white mx-2 md:mx-4 font-light text-3xl md:text-6xl">=</span>
                <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent animate-pulse" style={{ animationDelay: '1s' }}>
                  KNOVO
                </span>
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed">
              AI-powered voice based Quiz Platform
            </p>
            
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-purple-400"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 md:gap-16 w-full">
          
          {/* Container for Bot and Transcript - Equal Heights */}
          <div className="w-full flex flex-col lg:flex-row items-stretch justify-center gap-6">

            {/* Knovo Bot Image - Fixed Height to Match Transcript */}
            <div className="flex-shrink-0">
              <div className="relative h-full">
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-6 border border-purple-500/20 shadow-2xl backdrop-blur-sm h-[400px] md:h-[500px] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-indigo-600/10 rounded-3xl"></div>
                  <div className="relative z-10 w-60 h-60 sm:w-72 sm:h-72 md:w-[300px] md:h-[325px]">
                    <div className="w-full h-full rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
                      {/* Improved speaking animation - multiple concentric rings */}
                      {(running || isSpeaking) && (
                        <>
                          <div className="absolute inset-0 rounded-full border-4 border-cyan-400/60 animate-ping"></div>
                          <div className="absolute inset-2 rounded-full border-2 border-blue-400/40 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                          <div className="absolute inset-4 rounded-full border border-purple-400/20 animate-ping" style={{ animationDelay: '0.4s' }}></div>
                        </>
                      )}
                      
                      {/* Enhanced speaking effect with glow */}
                      {isSpeaking && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 animate-pulse"></div>
                      )}
                      
                      <div className="relative z-10 w-full h-full">
                        <Image 
                          src="/robot.png" 
                          alt="KnovoBot" 
                          layout="fill" 
                          objectFit="contain"
                          className="p-7" 
                        />
                      </div>
                      {running && (
                        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transcript Section - Fixed Height to Match Bot */}
            <div className="w-full max-w-4xl lg:max-w-3xl">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border border-gray-600/30 shadow-2xl overflow-hidden backdrop-blur-sm h-[400px] md:h-[500px] flex flex-col">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 md:p-6 border-b border-gray-600/30 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-100">Knovo Demo</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {running && (
                        <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-emerald-300 text-sm font-medium">Live</span>
                        </div>
                      )}
                      {isSpeaking && (
                        <div className="flex items-center gap-2">
                          <Mic className="w-4 h-4 text-blue-400 animate-pulse" />
                          <span className="text-blue-300 text-sm">Speaking</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Flexible content area that fills remaining height */}
                <div className="p-4 md:p-6 flex-1 min-h-0">
                  <div className="bg-gray-900/50 rounded-xl border border-gray-600/20 p-4 md:p-6 h-full overflow-hidden shadow-inner">
                    {messages.length === 0 && !starting && !running ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                          <MicOff className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-lg">Ready for a Demo?</p>
                        <p className="text-gray-500 text-sm mt-2">Click "Take Demo" to hear from our AI assistant</p>
                      </div>
                    ) : (
                      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-purple-500 scrollbar-thumb-rounded">
                        <div className="space-y-4 pr-2">
                          {messages.map((m) => {
                            const isUser = m.role === 'user';
                            return (
                              <div
                                key={m.id}
                                className={`${
                                  isUser 
                                    ? 'bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-xl ml-8' 
                                    : 'bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded-r-xl'
                                }`}
                              >
                                <div className={`text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2 ${
                                  isUser ? 'text-blue-400' : 'text-purple-400'
                                }`}>
                                  {isUser ? (
                                    <>
                                      <Mic className="w-3 h-3" />
                                      You
                                    </>
                                  ) : (
                                    <>
                                      <Zap className="w-3 h-3 fill-current" />
                                      Knovo Assistant
                                    </>
                                  )}
                                </div>
                                <div className="text-gray-200 leading-relaxed">{m.text}</div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            {!callEnded ? (
              <button
                className={`px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform ${
                  starting || running
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed scale-95'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 hover:scale-105 shadow-2xl hover:shadow-purple-500/25'
                }`}
                onClick={handleStart}
                disabled={starting || running}
              >
                {starting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    <span>Starting Demo...</span>
                  </div>
                ) : running ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>Demo Running...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Play className="w-6 h-6 fill-current" />
                    <span>Take Demo</span>
                  </div>
                )}
              </button>
            ) : (
              <button
                className="px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25"
                onClick={handleSignIn}
              >
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-6 h-6" />
                  <span>Start Quizzing!</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="text-center mt-auto pt-8 md:pt-12">
          <p className="text-gray-400 text-sm md:text-base">
            Experience the future of interactive learning with AI-powered voice technology
          </p>
        </div>
      </div>
    </div>
  );
}