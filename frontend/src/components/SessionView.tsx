'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChatPanel from '@/components/ChatPanel';
import EmotionalDashboard from '@/components/EmotionalDashboard';
import CurriculumGraph from '@/components/CurriculumGraph';
import RemixPanel from '@/components/RemixPanel';
import VoicePanel from '@/components/VoicePanel';
import { useChat, useCurriculum } from '@/lib/hooks';
import { CurriculumNode } from '@/lib/types';

type Tab = 'chat' | 'remix' | 'voice';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'chat',
    label: 'Chat',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'remix',
    label: 'Remix',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" /><path d="M8 3H3v5" />
        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" /><path d="m15 9 6-6" />
      </svg>
    ),
  },
  {
    id: 'voice',
    label: 'Voice',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
];

export default function SessionView({ sessionId, initialTab }: { sessionId: string; initialTab?: Tab }) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab ?? 'chat');

  const {
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
  } = useChat(sessionId);

  const { curriculum, completedNodes, loadCurriculum } = useCurriculum(sessionId);

  useEffect(() => {
    loadSession();
    loadCurriculum();
  }, [loadSession, loadCurriculum]);

  const totalNodes = curriculum?.nodes.length ?? 0;
  const progressPct = totalNodes > 0 ? (completedNodes.length / totalNodes) * 100 : 0;

  const handleNodeClick = (node: CurriculumNode) => {
    if (isLoading) return;
    send(`Teach me about: ${node.title}`);
  };

  const handleViewContent = (node: CurriculumNode) => {
    if (!node.content) return;
    addLocalMessage({
      role: 'module',
      content: node.content,
      title: node.title,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="flex flex-col h-screen gradient-mesh relative overflow-hidden">
      {/* Subtle ambient orbs */}
      <div className="orb orb-amber animate-float-slow" style={{ top: '-10%', right: '20%', width: '400px', height: '400px', opacity: 0.5 }} />
      <div className="orb orb-ice animate-float-medium" style={{ bottom: '-5%', left: '10%', width: '350px', height: '350px', opacity: 0.4 }} />

      <Header
        progressPct={progressPct}
        currentTopic={curriculum?.subject}
      />

      {curriculum && curriculum.nodes.length > 0 && (
        <CurriculumGraph
          nodes={curriculum.nodes}
          completedNodes={completedNodes}
          currentNodeId={curriculum.nodes[0]?.id}
          onNodeClick={handleNodeClick}
          onViewContent={handleViewContent}
        />
      )}

      {/* Tab bar */}
      <div className="glass-subtle border-b border-white/15 px-5 py-1.5 relative z-10">
        <div className="flex items-center gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber to-amber-dark text-white shadow-sm shadow-amber/20'
                  : 'text-foreground/45 hover:text-foreground/70 hover:bg-white/20'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'chat' && (
        <div className="flex flex-1 min-h-0 relative">
          <div className="flex-1 flex flex-col min-w-0">
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              onSend={send}
              agentActivity={agentActivity}
            />
            {error && (
              <div className="px-4 py-2.5 bg-red-50/80 backdrop-blur-sm border-t border-red-200/50 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}
          </div>
          <div className="w-80 lg:w-96 shrink-0 hidden md:flex flex-col border-l border-ice/40 bg-gradient-to-b from-ice-light/15 to-transparent">
            <EmotionalDashboard
              emotionalState={emotionalState}
              emotionalHistory={emotionalHistory}
              agentLog={agentLog}
            />
          </div>
        </div>
      )}

      {activeTab === 'remix' && (
        <div className="flex flex-1 min-h-0 relative">
          <RemixPanel
            nodes={curriculum?.nodes ?? []}
            completedNodes={completedNodes}
            sessionId={sessionId}
          />
        </div>
      )}

      {activeTab === 'voice' && (
        <div className="flex flex-1 min-h-0 relative">
          <VoicePanel />
        </div>
      )}
    </div>
  );
}
