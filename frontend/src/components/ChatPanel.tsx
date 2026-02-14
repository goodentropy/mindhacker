'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/lib/types';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import { useVoice } from '@/lib/useVoice';

export default function ChatPanel({
  messages,
  isLoading,
  onSend,
  agentActivity,
}: {
  messages: Message[];
  isLoading: boolean;
  onSend: (text: string) => void;
  agentActivity: string;
}) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isListening, transcript, isSupported, startListening, stopListening, speak, stopSpeaking } = useVoice();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Sync voice transcript to input field
  useEffect(() => {
    if (transcript) {
      setInput(prev => (prev ? prev + ' ' + transcript : transcript));
    }
  }, [transcript]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="relative mb-5">
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-ice-light to-ice/40 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EEAB3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="absolute -inset-2 rounded-3xl bg-amber/5 animate-breathe -z-10" />
            </div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-1.5">Ready to learn</h3>
            <p className="text-sm text-foreground/40 max-w-xs leading-relaxed">
              Start a conversation and I&apos;ll adapt my teaching to match how you&apos;re feeling.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} onSpeak={speak} onStopSpeaking={stopSpeaking} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Agent activity bar */}
      {agentActivity && (
        <div className="px-5 py-2.5 glass-subtle border-t border-ice/20 animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs text-foreground/50 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber" />
            </span>
            {agentActivity}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 glass-strong border-t border-white/20">
        <div className="flex items-end gap-3 input-glass px-4 py-3 focus-glow">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening...' : 'Type your message...'}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-ice-dark outline-none leading-relaxed"
            disabled={isLoading}
          />
          {isSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                  : 'glass text-foreground/50 hover:text-foreground/80'
              }`}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center shrink-0 disabled:opacity-30"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
