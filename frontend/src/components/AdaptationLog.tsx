'use client';

import { AgentLogEntry } from '@/lib/types';
import { useRef, useEffect } from 'react';

const TOOL_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  assess_emotional_state: { icon: '🧠', label: 'Emotional Assessor', color: '#8B5CF6' },
  adapt_content:          { icon: '🎯', label: 'Content Adapter',    color: '#EEAB3D' },
  generate_assessment:    { icon: '📝', label: 'Assessment Gen.',    color: '#22C55E' },
  parse_curriculum:       { icon: '📊', label: 'Curriculum Architect', color: '#3B82F6' },
  get_next_curriculum_node: { icon: '➡️', label: 'Navigator',        color: '#F97316' },
};

export default function AdaptationLog({ log }: { log: AgentLogEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  if (log.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-24 text-center">
        <span className="text-foreground/15 text-lg mb-1">⚡</span>
        <span className="text-[10px] text-foreground/25 font-medium">Waiting for activity...</span>
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-52 overflow-y-auto scrollbar-hide font-mono">
      {log.map((entry, i) => {
        const cfg = TOOL_CONFIG[entry.tool] || { icon: '⚙️', label: entry.tool, color: '#94A3B8' };
        return (
          <div
            key={i}
            className="flex items-start gap-2 text-[11px] py-1.5 px-2 rounded-lg hover:bg-foreground/[0.02] transition-colors animate-fade-in-up"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div
              className="w-1 h-1 rounded-full shrink-0 mt-1.5"
              style={{ backgroundColor: cfg.color, boxShadow: `0 0 6px ${cfg.color}60` }}
            />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-foreground/60" style={{ fontFamily: 'var(--font-heading)' }}>
                {cfg.label}
              </span>
              <span className="text-foreground/25 mx-1.5">&middot;</span>
              <span className="text-foreground/35 truncate">{entry.input_summary}</span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
