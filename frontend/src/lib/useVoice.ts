'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceReturn {
  isListening: boolean;
  transcript: string;
  isSpeaking: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionInstance = any;

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s?/g, '')        // headings
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1') // bold/italic
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // inline code and code blocks
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links
    .replace(/^[-*+]\s/gm, '')        // list markers
    .replace(/^\d+\.\s/gm, '')        // ordered list markers
    .replace(/>\s?/g, '')             // blockquotes
    .replace(/---+/g, '')             // horizontal rules
    .replace(/\n{3,}/g, '\n\n')       // excessive newlines
    .trim();
}

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const hasSynthesis = 'speechSynthesis' in window;
    setIsSupported(hasSpeechRecognition || hasSynthesis);
    if (hasSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      recognitionRef.current?.abort();
      synthRef.current?.cancel();
    };
  }, []);

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      const result = event.results[0]?.[0]?.transcript ?? '';
      setTranscript(result);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript('');
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(stripMarkdown(text));
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    transcript,
    isSpeaking,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
