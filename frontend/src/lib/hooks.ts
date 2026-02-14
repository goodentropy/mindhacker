'use client';

import { useState, useCallback } from 'react';
import { sendMessage, getSession } from './api';
import { isDemoSession, loadDemoSession, ensureBackendSession } from './demo';
import { Message, EmotionalState, AgentLogEntry, Curriculum } from './types';

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [emotionalHistory, setEmotionalHistory] = useState<EmotionalState[]>([]);
  const [agentLog, setAgentLog] = useState<AgentLogEntry[]>([]);
  const [agentActivity, setAgentActivity] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setAgentActivity('Analyzing your message...');
    setError(null);

    try {
      const effectiveSessionId = await ensureBackendSession(sessionId);
      const res = await sendMessage(effectiveSessionId, text);
      const assistantMsg: Message = { role: 'assistant', content: res.response, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, assistantMsg]);

      if (res.emotional_state) {
        setEmotionalState(res.emotional_state);
        setEmotionalHistory(prev => [...prev, res.emotional_state!]);
      }

      setAgentLog(prev => [...prev, ...res.agent_log]);
      setAgentActivity('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setAgentActivity('');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading]);

  // Load existing session data
  const loadSession = useCallback(async () => {
    // Try local demo data first
    if (isDemoSession(sessionId)) {
      const demo = loadDemoSession(sessionId);
      if (demo) {
        if (demo.messages?.length) setMessages(demo.messages);
        if (demo.emotional_history?.length) {
          setEmotionalHistory(demo.emotional_history);
          setEmotionalState(demo.emotional_history[demo.emotional_history.length - 1]);
        }
        return;
      }
    }

    try {
      const data = await getSession(sessionId);
      if (data.messages?.length) {
        setMessages(data.messages);
      }
      if (data.emotional_history?.length) {
        setEmotionalHistory(data.emotional_history);
        setEmotionalState(data.emotional_history[data.emotional_history.length - 1]);
      }
    } catch {
      // Session might be new
    }
  }, [sessionId]);

  const addLocalMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  return {
    messages,
    isLoading,
    emotionalState,
    emotionalHistory,
    agentLog,
    agentActivity,
    error,
    send,
    addLocalMessage,
    loadSession,
  };
}

export function useCurriculum(sessionId: string) {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);

  const loadCurriculum = useCallback(async () => {
    // Try local demo data first
    if (isDemoSession(sessionId)) {
      const demo = loadDemoSession(sessionId);
      if (demo) {
        if (demo.curriculum) setCurriculum(demo.curriculum);
        if (demo.completed_nodes) setCompletedNodes(demo.completed_nodes);
        return;
      }
    }

    try {
      const data = await getSession(sessionId);
      if (data.curriculum) setCurriculum(data.curriculum);
      if (data.completed_nodes) setCompletedNodes(data.completed_nodes);
    } catch {
      // ignore
    }
  }, [sessionId]);

  return { curriculum, completedNodes, loadCurriculum };
}
