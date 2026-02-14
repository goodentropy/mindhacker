'use client';

import { EmotionalState, AgentLogEntry } from '@/lib/types';
import EmotionGauge from './EmotionGauge';
import EmotionTimeline from './EmotionTimeline';
import AdaptationLog from './AdaptationLog';

const DIMENSIONS = ['engagement', 'confidence', 'frustration', 'curiosity', 'cognitive_load'] as const;

interface StudentStatus {
  label: string;
  color: string;      // tailwind color name
  dotColor: string;    // hex for the dot
  strategy: string;
  strategyIcon: string;
}

function deriveStatus(s: EmotionalState): StudentStatus {
  if (s.frustration > 0.6 || s.cognitive_load > 0.7) {
    return { label: 'Needs Support', color: 'red', dotColor: '#EF4444', strategy: 'Scaffolding', strategyIcon: '🪜' };
  }
  if (s.engagement < 0.3) {
    return { label: 'Disengaging', color: 'amber', dotColor: '#EEAB3D', strategy: 'Reconnecting', strategyIcon: '🌉' };
  }
  if (s.confidence > 0.7 && s.frustration < 0.3) {
    return { label: 'Ready for Challenge', color: 'blue', dotColor: '#3B82F6', strategy: 'Challenging', strategyIcon: '🎯' };
  }
  if (s.engagement > 0.5 && s.frustration < 0.4) {
    return { label: 'Engaged & Learning', color: 'green', dotColor: '#22C55E', strategy: 'Neutral', strategyIcon: '✨' };
  }
  return { label: 'Monitoring', color: 'slate', dotColor: '#94A3B8', strategy: 'Observing', strategyIcon: '👁️' };
}

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  red:   { bg: 'from-red-500/10 to-red-600/5', border: 'border-red-400/20', text: 'text-red-600' },
  amber: { bg: 'from-amber/10 to-amber-dark/5', border: 'border-amber/20', text: 'text-amber-dark' },
  blue:  { bg: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-400/20', text: 'text-blue-600' },
  green: { bg: 'from-green-500/10 to-green-600/5', border: 'border-green-400/20', text: 'text-green-600' },
  slate: { bg: 'from-slate-400/10 to-slate-500/5', border: 'border-slate-300/20', text: 'text-slate-500' },
};

export default function EmotionalDashboard({
  emotionalState,
  emotionalHistory,
  agentLog,
}: {
  emotionalState: EmotionalState | null;
  emotionalHistory: EmotionalState[];
  agentLog: AgentLogEntry[];
}) {
  const state = emotionalState || {
    engagement: 0.5,
    confidence: 0.5,
    frustration: 0,
    curiosity: 0.5,
    cognitive_load: 0.3,
  };

  const flowScore = emotionalState?.flow_score ?? 0;
  const dropoutRisk = emotionalState?.dropout_risk ?? 0;
  const status = deriveStatus(state as EmotionalState);
  const sty = STATUS_STYLES[status.color] || STATUS_STYLES.slate;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-5 space-y-5">
      {/* ── Student Status Card ── */}
      <section className="animate-slide-up" style={{ animationDelay: '0ms' }}>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${sty.bg} border ${sty.border} transition-all duration-500`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full animate-glow-pulse" style={{ backgroundColor: status.dotColor }} />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-40" style={{ backgroundColor: status.dotColor }} />
              </div>
              <span className={`text-xs font-heading font-bold uppercase tracking-wider ${sty.text}`}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/50 backdrop-blur-sm">
              <span className="text-xs">{status.strategyIcon}</span>
              <span className="text-[10px] font-semibold text-foreground/50">{status.strategy}</span>
            </div>
          </div>
          {/* Mini flow bar */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-foreground/35 font-medium w-8 shrink-0">Flow</span>
            <div className="flex-1 h-1.5 bg-white/40 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${flowScore * 100}%`,
                  backgroundColor: status.dotColor,
                  boxShadow: `0 0 8px ${status.dotColor}40`,
                }}
              />
            </div>
            <span className="text-[10px] font-heading font-bold text-foreground/50 w-7 text-right">
              {(flowScore * 100).toFixed(0)}
            </span>
          </div>
        </div>
      </section>

      {/* ── Emotional Gauges ── */}
      <section className="animate-slide-up" style={{ animationDelay: '60ms' }}>
        <h3 className="text-[10px] font-heading font-bold text-foreground/35 uppercase tracking-[0.2em] mb-3">
          Emotional State
        </h3>
        <div className="grid grid-cols-3 gap-2 place-items-center">
          {DIMENSIONS.map((dim, i) => (
            <div key={dim} className="animate-scale-in" style={{ animationDelay: `${80 + i * 50}ms` }}>
              <EmotionGauge dimension={dim} value={state[dim]} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Composite Scores ── */}
      {emotionalState && (
        <section className="animate-slide-up" style={{ animationDelay: '120ms' }}>
          <h3 className="text-[10px] font-heading font-bold text-foreground/35 uppercase tracking-[0.2em] mb-3">
            Risk Analysis
          </h3>
          <div className="glass rounded-2xl p-4 space-y-3">
            {/* Dropout Risk */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold text-foreground/45">Dropout Risk</span>
                <span className={`text-sm font-heading font-bold ${
                  dropoutRisk > 0.5 ? 'text-red-500' : dropoutRisk > 0.3 ? 'text-amber' : 'text-green-500'
                }`}>
                  {(dropoutRisk * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-ice/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${dropoutRisk * 100}%`,
                    background: dropoutRisk > 0.5
                      ? 'linear-gradient(90deg, #F97316, #EF4444)'
                      : dropoutRisk > 0.3
                      ? 'linear-gradient(90deg, #EEAB3D, #F97316)'
                      : 'linear-gradient(90deg, #22C55E, #4ADE80)',
                  }}
                />
              </div>
            </div>
            {/* Readiness */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold text-foreground/45">Challenge Readiness</span>
                <span className="text-sm font-heading font-bold gradient-text-static">
                  {(flowScore * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-ice/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${flowScore * 100}%`,
                    background: 'linear-gradient(90deg, #EEAB3D, #F5CC7A)',
                    boxShadow: '0 0 8px rgba(238, 171, 61, 0.3)',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Emotion Timeline ── */}
      <section className="animate-slide-up" style={{ animationDelay: '180ms' }}>
        <h3 className="text-[10px] font-heading font-bold text-foreground/35 uppercase tracking-[0.2em] mb-3">
          Emotional Timeline
        </h3>
        <div className="glass rounded-2xl p-3">
          <EmotionTimeline history={emotionalHistory} />
        </div>
      </section>

      {/* ── Agent Activity Feed ── */}
      <section className="animate-slide-up flex-1 min-h-0" style={{ animationDelay: '240ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-heading font-bold text-foreground/35 uppercase tracking-[0.2em]">
            Agent Feed
          </h3>
          {agentLog.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber" />
              </span>
              <span className="text-[9px] text-foreground/30 font-medium">LIVE</span>
            </div>
          )}
        </div>
        <div className="glass rounded-2xl p-4">
          <AdaptationLog log={agentLog} />
        </div>
      </section>
    </div>
  );
}
