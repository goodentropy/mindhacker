'use client';

import { useState } from 'react';
import { CurriculumNode } from '@/lib/types';

export default function CurriculumGraph({
  nodes,
  completedNodes,
  currentNodeId,
  onNodeClick,
  onViewContent,
  onRemix,
}: {
  nodes: CurriculumNode[];
  completedNodes: string[];
  currentNodeId?: string;
  onNodeClick?: (node: CurriculumNode) => void;
  onViewContent?: (node: CurriculumNode) => void;
  onRemix?: (node: CurriculumNode, prompt?: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [remixNodeId, setRemixNodeId] = useState<string | null>(null);
  const [remixPrompt, setRemixPrompt] = useState('');

  if (nodes.length === 0) return null;

  return (
    <div className="glass-subtle border-b border-white/15 relative z-10">
      {/* Node circles */}
      <div className="flex items-center gap-1 overflow-x-auto px-5 py-3 scrollbar-hide">
        {nodes.map((node, i) => {
          const isCompleted = completedNodes.includes(node.id);
          const isCurrent = node.id === currentNodeId;
          const isExpanded = expandedId === node.id;

          return (
            <div key={node.id} className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : node.id)}
                className={`group relative flex items-center justify-center w-8 h-8 rounded-full text-[10px] font-heading font-bold transition-all duration-300 cursor-pointer
                  ${isCompleted
                    ? 'bg-gradient-to-br from-amber to-amber-dark text-white shadow-md shadow-amber/20 hover:shadow-lg hover:shadow-amber/30 hover:scale-110'
                    : isCurrent
                    ? 'bg-amber/10 text-amber border-2 border-amber animate-pulse-amber hover:bg-amber/20 hover:scale-110'
                    : 'bg-ice/40 text-ice-dark backdrop-blur-sm hover:bg-ice/60 hover:scale-110'
                  }
                  ${isExpanded ? 'ring-2 ring-amber/40 scale-110' : ''}`}
                title={node.title}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
                {/* Tooltip (only when not expanded) */}
                {!isExpanded && (
                  <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 pointer-events-none">
                    <div className="glass-strong text-foreground text-[10px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                      {node.title}
                    </div>
                  </div>
                )}
              </button>
              {i < nodes.length - 1 && (
                <div className={`w-5 h-[2px] rounded-full transition-colors duration-500 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-amber to-amber-light'
                    : 'bg-ice/40'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded module panel */}
      {expandedId && (() => {
        const node = nodes.find(n => n.id === expandedId);
        if (!node) return null;
        const idx = nodes.indexOf(node);
        return (
          <div className="px-5 pb-3 animate-fade-in-up">
            <div className="glass rounded-xl p-4 max-w-2xl">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber/15 to-amber/5 text-amber font-heading font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-foreground truncate">{node.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedId(null)}
                  className="text-foreground/30 hover:text-foreground/60 transition-colors shrink-0 p-0.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-foreground/50 mb-3 leading-relaxed">{node.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {node.content && (
                  <button
                    type="button"
                    onClick={() => { onViewContent?.(node); setExpandedId(null); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-primary text-[11px] font-semibold"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    View Reading
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { onNodeClick?.(node); setExpandedId(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-[11px] font-semibold text-foreground/60 hover:text-foreground/80 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Teach Me
                </button>
                {onRemix && (
                  <button
                    type="button"
                    onClick={() => { setRemixNodeId(remixNodeId === node.id ? null : node.id); setRemixPrompt(''); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-[11px] font-semibold text-purple-600/70 hover:text-purple-600 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 3h5v5" />
                      <path d="M8 3H3v5" />
                      <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
                      <path d="m15 9 6-6" />
                    </svg>
                    Remix
                  </button>
                )}
              </div>
              {/* Remix prompt input */}
              {remixNodeId === node.id && onRemix && (
                <div className="mt-3 flex items-center gap-2 animate-fade-in-up">
                  <input
                    type="text"
                    value={remixPrompt}
                    onChange={e => setRemixPrompt(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        onRemix(node, remixPrompt || undefined);
                        setRemixNodeId(null);
                        setRemixPrompt('');
                        setExpandedId(null);
                      }
                    }}
                    placeholder="e.g., I like music, sports, cooking..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-purple-200/50 outline-none focus:border-purple-400/60 text-foreground placeholder:text-foreground/30"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onRemix(node, remixPrompt || undefined);
                      setRemixNodeId(null);
                      setRemixPrompt('');
                      setExpandedId(null);
                    }}
                    className="px-3 py-2 rounded-lg bg-purple-500/80 text-white text-[11px] font-semibold hover:bg-purple-500 transition-colors"
                  >
                    Go
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
