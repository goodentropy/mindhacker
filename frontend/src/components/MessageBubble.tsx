'use client';

import { useState } from 'react';
import { Message } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

const SpeakButton = ({ content, onSpeak, onStopSpeaking }: { content: string; onSpeak?: (text: string) => void; onStopSpeaking?: () => void }) => {
  const [playing, setPlaying] = useState(false);
  if (!onSpeak) return null;
  return (
    <button
      type="button"
      onClick={() => {
        if (playing) {
          onStopSpeaking?.();
          setPlaying(false);
        } else {
          onSpeak(content);
          setPlaying(true);
          // Auto-reset after estimated duration (fallback in case onend doesn't fire)
          setTimeout(() => setPlaying(false), Math.max(content.length * 60, 3000));
        }
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-black/5"
      title={playing ? 'Stop speaking' : 'Read aloud'}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40 hover:text-foreground/70">
        {playing ? (
          <>
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </>
        ) : (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        )}
      </svg>
    </button>
  );
};

export default function MessageBubble({ message, onSpeak, onStopSpeaking }: { message: Message; onSpeak?: (text: string) => void; onStopSpeaking?: () => void }) {
  const isUser = message.role === 'user';
  const isModule = message.role === 'module';

  if (isModule) {
    return (
      <div className="flex justify-start animate-fade-in-up group">
        <div className="max-w-[90%] rounded-2xl overflow-hidden shadow-sm border border-amber/15">
          {/* Module header */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-amber/10 to-amber/5 border-b border-amber/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EEAB3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span className="text-xs font-heading font-bold text-amber-dark tracking-wide uppercase">
              {message.title || 'Module Reading'}
            </span>
            <SpeakButton content={message.content} onSpeak={onSpeak} onStopSpeaking={onStopSpeaking} />
          </div>
          {/* Module content */}
          <div className="px-5 py-4 bg-white/60 backdrop-blur-sm">
            <div className="prose-module text-sm leading-[1.75] text-foreground/80">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex animate-fade-in-up group ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all ${
          isUser
            ? 'bg-gradient-to-br from-amber to-amber-dark text-white rounded-br-md shadow-lg shadow-amber/15'
            : 'glass rounded-bl-md shadow-sm'
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <>
            <div className="prose-chat">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            <div className="flex justify-end mt-1">
              <SpeakButton content={message.content} onSpeak={onSpeak} onStopSpeaking={onStopSpeaking} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="glass rounded-2xl rounded-bl-md px-5 py-3.5 flex items-center gap-2 shadow-sm">
        <span className="typing-dot w-2 h-2 rounded-full bg-amber/60" />
        <span className="typing-dot w-2 h-2 rounded-full bg-amber/60" />
        <span className="typing-dot w-2 h-2 rounded-full bg-amber/60" />
      </div>
    </div>
  );
}
