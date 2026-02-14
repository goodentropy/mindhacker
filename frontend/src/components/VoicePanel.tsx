'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';

interface TranscriptEntry {
  role: 'user' | 'agent';
  message: string;
}

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

export default function VoicePanel() {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onMessage: useCallback(({ message, role }: { message: string; role: 'user' | 'agent' }) => {
      setTranscript(prev => [...prev, { role, message }]);
    }, []),
    onError: useCallback((message: string) => {
      console.error('ElevenLabs error:', message);
    }, []),
  });

  const { status, isSpeaking } = conversation;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (status === 'connected') {
        conversation.endSession();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = async () => {
    if (!AGENT_ID) return;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId: AGENT_ID, connectionType: 'websocket' });
    } catch (err) {
      console.error('Failed to start voice session:', err);
    }
  };

  const handleEnd = async () => {
    await conversation.endSession();
    setTranscript([]);
  };

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  if (!AGENT_ID) {
    return (
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber/10 to-amber/5 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EEAB3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
          <h3 className="text-lg font-heading font-bold text-foreground mb-1.5">Voice agent not configured</h3>
          <p className="text-sm text-foreground/40 max-w-xs leading-relaxed">
            Set <code className="text-xs bg-ice/40 px-1.5 py-0.5 rounded">NEXT_PUBLIC_ELEVENLABS_AGENT_ID</code> in your environment to enable the voice assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-5 py-8 overflow-hidden">
      {/* Voice orb */}
      <div className="relative mb-6 shrink-0">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
            isConnected
              ? isSpeaking
                ? 'bg-gradient-to-br from-amber to-amber-dark shadow-lg shadow-amber/30 scale-105'
                : 'bg-gradient-to-br from-amber to-amber-dark shadow-md shadow-amber/20'
              : 'glass'
          }`}
        >
          {/* Pulse ring when speaking */}
          {isConnected && isSpeaking && (
            <div className="absolute inset-0 rounded-full border-2 border-amber/40 animate-[pulse-ring_1.5s_ease-out_infinite]" />
          )}

          {/* Sound bars */}
          {isConnected ? (
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    isSpeaking
                      ? 'bg-white'
                      : 'bg-white/60'
                  }`}
                  style={{
                    height: isSpeaking ? undefined : '8px',
                    animation: isSpeaking
                      ? `voice-bar 0.${4 + i}s ease-in-out infinite alternate`
                      : 'none',
                  }}
                />
              ))}
            </div>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={isConnecting ? '#EEAB3D' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={isConnecting ? '' : 'text-foreground/30'}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </div>

        {/* Status label */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
            isConnected
              ? isSpeaking
                ? 'bg-amber/15 text-amber-dark'
                : 'bg-green-100 text-green-700'
              : isConnecting
              ? 'bg-amber/10 text-amber animate-pulse'
              : 'bg-ice/40 text-foreground/40'
          }`}>
            {isConnected ? (isSpeaking ? 'Speaking' : 'Listening') : isConnecting ? 'Connecting...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 shrink-0">
        {isConnected ? (
          <button
            type="button"
            onClick={handleEnd}
            className="px-6 py-2.5 rounded-xl bg-red-500/90 text-white text-sm font-semibold hover:bg-red-500 transition-colors shadow-md shadow-red-500/20 cursor-pointer"
          >
            End Conversation
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStart}
            disabled={isConnecting}
            className="px-6 py-2.5 rounded-xl btn-primary text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Start Conversation'}
          </button>
        )}
      </div>

      {/* Transcript */}
      <div className="flex-1 w-full max-w-lg overflow-y-auto space-y-3">
        {transcript.length === 0 && !isConnected && (
          <div className="text-center py-8">
            <p className="text-sm text-foreground/35">
              Start a conversation to talk with your AI tutor.
            </p>
          </div>
        )}
        {transcript.length === 0 && isConnected && (
          <div className="text-center py-8">
            <p className="text-sm text-foreground/35 animate-pulse">
              Listening... say something!
            </p>
          </div>
        )}
        {transcript.map((entry, i) => (
          <div
            key={i}
            className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                entry.role === 'user'
                  ? 'bg-gradient-to-br from-amber to-amber-dark text-white rounded-br-md'
                  : 'glass text-foreground rounded-bl-md'
              }`}
            >
              {entry.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
