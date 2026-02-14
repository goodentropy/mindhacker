'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import ChatPanel from '@/components/ChatPanel';
import EmotionalDashboard from '@/components/EmotionalDashboard';
import CurriculumGraph from '@/components/CurriculumGraph';
import { useChat, useCurriculum } from '@/lib/hooks';
import { CurriculumNode } from '@/lib/types';

export default function SessionView({ sessionId }: { sessionId: string }) {
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

  const handleRemix = (node: CurriculumNode, prompt?: string) => {
    if (isLoading) return;
    const message = prompt
      ? `Remix the module '${node.title}' for me. My interests: ${prompt}. Adapt using analogies from my interests.`
      : `Remix the module '${node.title}' in a creative, engaging way.`;
    send(message);
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
          onRemix={handleRemix}
        />
      )}

      <div className="flex flex-1 min-h-0 relative">
        {/* Chat panel */}
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

        {/* Emotional Dashboard sidebar */}
        <div className="w-80 lg:w-96 shrink-0 hidden md:flex flex-col border-l border-ice/40 bg-gradient-to-b from-ice-light/15 to-transparent">
          <EmotionalDashboard
            emotionalState={emotionalState}
            emotionalHistory={emotionalHistory}
            agentLog={agentLog}
          />
        </div>
      </div>
    </div>
  );
}
