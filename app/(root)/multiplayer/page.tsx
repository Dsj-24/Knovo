"use client";

import React, { useEffect, useRef, useState } from "react";
import { vapi } from "@/lib/vapi.sdk"; // your vapi SDK wrapper
import Image from "next/image";
import { Zap } from "lucide-react";

/**
 * Minimal "Call" page that starts the Misc workflow and shows live transcripts.
 * (Does NOT use Agent component.)
 * 
 */
export default function MiscWorkflowStandalonePage() {
  const workflowId = process.env.NEXT_PUBLIC_VAPI_MISCELLANEOUS_ID;
  const [running, setRunning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role?: string; text: string }[]>([]);
  const msgIdRef = useRef(0);

  // register vapi event handlers
  useEffect(() => {
    const onCallStart = () => {
      setRunning(true);
      console.log("[vapi] call-start");
    };
    const onCallEnd = () => {
      setRunning(false);
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
    const onError = (err: any) => console.error("[vapi] error", err);

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

  // start the workflow
  const handleStart = async () => {
    if (!workflowId) {
      alert("Missing NEXT_PUBLIC_VAPI_MISCELLANEOUS_ID in .env.local");
      return;
    }
    setStarting(true);
    setMessages([]);
    try {
      const variableValues = {
        userName: "Player",
        userId: null,
      };

      await vapi.start(undefined, undefined, undefined, workflowId, { variableValues });
    } catch (err: any) {
      console.error("Failed to start workflow", err);
      alert("Failed to start workflow. See console.");
    } finally {
      setStarting(false);
    }
  };

  // stop the workflow
  const handleStop = () => {
    try {
      vapi.stop();
    } catch (err) {
      console.error("Failed to stop workflow", err);
    }
  };

  return (
    
    
    <div className="w-full mx-auto p-4 sm:p-6 md:p-8 bg-blue-900 min-h-fit rounded-2xl sm:rounded-3xl">
      {/* Enhanced Challenge Mode Card with Sea Blue Gradient */}
      <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-teal-700 rounded-2xl sm:rounded-3xl border-2 border-cyan-400/30 p-6 sm:p-10 md:p-12 text-center mb-8 sm:mb-10 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-cyan-200 via-blue-200 to-teal-200 bg-clip-text text-transparent">
            Challenge Mode
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-cyan-100 leading-relaxed font-medium">
            Random topic, any format — Check your knowledge , vocal and expressive abilities and let us adjust difficulty for you on basis of your ongoing performance .
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 bg-emerald-500/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-400/30">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-300 rounded-full"></div>
              <span className="text-xs sm:text-sm font-medium text-emerald-200">AI Powered</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-500/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-400/30">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-300 rounded-full"></div>
              <span className="text-xs sm:text-sm font-medium text-blue-200">Real-time</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-500/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-purple-400/30">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-300 rounded-full"></div>
              <span className="text-xs sm:text-sm font-medium text-purple-200">Interactive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Call Section - Dark Grey */}
      <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl border-2 border-gray-600/50 shadow-2xl p-6 sm:p-10 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-8">
          <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
            <div className="relative shrink-0">
           <Zap className="w-15 h-15 text-white relative z-10 group-hover:scale-110 transition-transform duration-300 fill-current" />
              {running && (
                <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-900 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-1.5 sm:mb-2">Miscellaneous Challenge</h2>
              <div className="flex items-center gap-3 sm:gap-4 mt-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  running 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${running ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}></div>
                  {running ? 'Active' : 'Standby'}
                </div>
                {isSpeaking && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    Listening
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Buttons */}
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 sm:gap-4">
            <button
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 transform ${
                starting || running
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-gray-100 hover:from-cyan-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
              onClick={handleStart}
              disabled={starting || running}
            >
              {starting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  Starting…
                </div>
              ) : running ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  Running
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </div>
              )}
            </button>
            <button
              className={`px-6 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 border-2 ${
                !running
                  ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                  : 'border-red-500 text-red-400 hover:bg-red-500/10 hover:scale-105'
              }`}
              onClick={handleStop}
              disabled={!running}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 21V8a5 5 0 015-5l6 6 5-5" />
                </svg>
                End
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Transcript Section - Dark Grey */}
      <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl border-2 border-gray-600/50 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-100">Live Transcript</h3>
            </div>
            <div className="flex items-center gap-3">
              {isSpeaking && (
                <>
                  <div className="flex items-center gap-2 bg-emerald-500/20 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-500/30">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-ping"></div>
                    <span className="text-emerald-300 text-xs sm:text-sm font-medium">Listening</span>
                  </div>
                  <div className="hidden sm:flex gap-1">
                    <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-6 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 md:p-8">
          <div className="bg-gray-900 rounded-xl border border-gray-600/30 p-4 sm:p-6 min-h-[220px] sm:min-h-[280px] md:min-h-[300px] max-h-[45vh] sm:max-h-[460px] overflow-auto shadow-inner">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-base sm:text-lg">No transcripts yet</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Start a call to see live transcription</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 sm:p-4 rounded-xl ${
                      m.role === 'user' 
                        ? 'bg-blue-500/10 border-l-4 border-blue-500 ml-3 sm:ml-8'
                        : 'bg-purple-500/10 border-l-4 border-purple-500 mr-3 sm:mr-8'
                    }`}
                  >
                    <div
                      className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1.5 sm:mb-2 ${
                        m.role === 'user' ? 'text-blue-400' : 'text-purple-400'
                      }`}
                    >
                      {m.role === 'user' ? '👤 You' : '🤖 Assistant'}
                    </div>
                    <div className="text-gray-200 leading-relaxed text-sm sm:text-base">{m.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
