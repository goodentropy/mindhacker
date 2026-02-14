'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CurriculumNode } from '@/lib/types';
import { sendMessage } from '@/lib/api';

type Phase = 'select' | 'prompt' | 'result';

const FORMAT_CHIPS = [
  { label: 'Songwriting project', emoji: '🎵' },
  { label: 'Basketball analogies', emoji: '🏀' },
  { label: 'Cooking recipe', emoji: '🍳' },
  { label: 'Debate format', emoji: '🎤' },
  { label: 'Comic strip', emoji: '🎨' },
  { label: 'Game show', emoji: '🎮' },
];

export default function RemixPanel({
  nodes,
  completedNodes,
  sessionId,
}: {
  nodes: CurriculumNode[];
  completedNodes: string[];
  sessionId: string;
}) {
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedNode, setSelectedNode] = useState<CurriculumNode | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectNode = (node: CurriculumNode) => {
    setSelectedNode(node);
    setPrompt('');
    setPhase('prompt');
  };

  const handleChipClick = (label: string) => {
    setPrompt(label);
  };

  const handleRemix = async () => {
    if (!selectedNode || !prompt.trim()) return;
    setIsLoading(true);
    setError(null);

    const message = `Remix the module '${selectedNode.title}' for me. Here's how I want to learn it: ${prompt.trim()}. Transform the curriculum content into this format while preserving all the key facts and learning objectives.`;

    try {
      const res = await sendMessage(sessionId, message);
      setResult(res.response);
      setPhase('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remix failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRemix = () => {
    setSelectedNode(null);
    setPrompt('');
    setResult('');
    setError(null);
    setPhase('select');
  };

  const handleRemixAgain = () => {
    setPrompt('');
    setResult('');
    setError(null);
    setPhase('prompt');
  };

  if (nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5" /><path d="M8 3H3v5" />
              <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" /><path d="m15 9 6-6" />
            </svg>
          </div>
          <h3 className="text-lg font-heading font-bold text-foreground mb-1.5">No curriculum loaded</h3>
          <p className="text-sm text-foreground/40 max-w-xs leading-relaxed">
            Upload a curriculum first, then remix any module into a creative format.
          </p>
        </div>
      </div>
    );
  }

  /* ─── Phase 1: Select ─── */
  if (phase === 'select') {
    return (
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-lg text-foreground mb-1">Choose a module to remix</h2>
          <p className="text-sm text-foreground/40 mb-5">Pick any topic and transform it into a creative learning format.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nodes.map((node, i) => {
              const isCompleted = completedNodes.includes(node.id);
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleSelectNode(node)}
                  className="glass card-hover rounded-xl p-4 text-left group cursor-pointer transition-all hover:border-purple-300/50"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className={`w-7 h-7 rounded-lg text-[11px] font-heading font-bold flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-amber to-amber-dark text-white'
                        : 'bg-ice/40 text-ice-dark'
                    }`}>
                      {isCompleted ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-foreground truncate group-hover:text-purple-700 transition-colors">
                      {node.title}
                    </h4>
                  </div>
                  <p className="text-xs text-foreground/45 leading-relaxed line-clamp-2">{node.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Phase 2: Prompt ─── */
  if (phase === 'prompt' && selectedNode) {
    return (
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <button
            type="button"
            onClick={handleNewRemix}
            className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/70 transition-colors mb-4"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to modules
          </button>

          {/* Selected node summary */}
          <div className="glass rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-400/20 to-purple-400/5 text-purple-600 font-heading font-bold text-[10px] flex items-center justify-center shrink-0">
                {nodes.indexOf(selectedNode) + 1}
              </span>
              <h3 className="font-heading font-bold text-sm text-foreground">{selectedNode.title}</h3>
            </div>
            <p className="text-xs text-foreground/45 leading-relaxed">{selectedNode.description}</p>
          </div>

          {/* Quick format chips */}
          <p className="text-xs font-semibold text-foreground/50 mb-2.5">Quick formats</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {FORMAT_CHIPS.map(chip => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleChipClick(chip.label)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  prompt === chip.label
                    ? 'bg-purple-500/80 text-white shadow-md shadow-purple-500/20'
                    : 'glass text-foreground/55 hover:text-purple-600 hover:border-purple-200/50'
                }`}
              >
                {chip.emoji} {chip.label}
              </button>
            ))}
          </div>

          {/* Custom prompt textarea */}
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Or describe your own format..."
            rows={3}
            className="w-full text-sm px-4 py-3 rounded-xl input-glass focus-glow resize-none text-foreground placeholder:text-foreground/30 mb-4"
          />

          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Remix button */}
          <button
            type="button"
            onClick={handleRemix}
            disabled={!prompt.trim() || isLoading}
            className="w-full py-3 rounded-xl btn-primary text-sm font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Remixing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3h5v5" /><path d="M8 3H3v5" />
                  <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" /><path d="m15 9 6-6" />
                </svg>
                Remix It
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  /* ─── Phase 3: Result ─── */
  return (
    <div className="flex-1 overflow-y-auto px-5 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400/20 to-purple-400/5 text-purple-600 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5" /><path d="M8 3H3v5" />
              <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" /><path d="m15 9 6-6" />
            </svg>
          </span>
          <h3 className="font-heading font-bold text-sm text-foreground">{selectedNode?.title} — Remixed</h3>
        </div>

        {/* Result content */}
        <div className="glass rounded-xl p-5 mb-5 animate-fade-in-up">
          <div className="prose-chat text-sm">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleNewRemix}
            className="flex-1 py-2.5 rounded-xl glass text-sm font-semibold text-foreground/60 hover:text-foreground/80 transition-colors cursor-pointer"
          >
            New Remix
          </button>
          <button
            type="button"
            onClick={handleRemixAgain}
            className="flex-1 py-2.5 rounded-xl btn-primary text-sm font-semibold cursor-pointer"
          >
            Remix Again
          </button>
        </div>
      </div>
    </div>
  );
}
