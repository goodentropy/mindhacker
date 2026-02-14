'use client';

const DIMENSIONS = [
  {
    key: 'engagement',
    label: 'Engagement',
    color: '#EEAB3D',
    range: '0.0 withdrawn — 1.0 fully present',
    signals: ['Message length and detail', 'Question-asking frequency', 'Response latency'],
    low: 'Short answers, long pauses, topic deflection',
    high: 'Asks follow-ups, offers opinions, deep responses',
  },
  {
    key: 'confidence',
    label: 'Confidence',
    color: '#22C55E',
    range: '0.0 anxious — 1.0 secure',
    signals: ['Hedging language ("I think maybe...")', 'Willingness to attempt problems', 'Self-correction patterns'],
    low: '"I\'m probably wrong but..." or refusal to try',
    high: 'Direct answers, willingness to debate, self-advocacy',
  },
  {
    key: 'frustration',
    label: 'Frustration',
    color: '#EF4444',
    range: '0.0 calm — 1.0 activated',
    signals: ['Repetitive errors', 'Shortened responses', 'Negative self-talk'],
    low: 'Patient with process, accepts mistakes calmly',
    high: '"I don\'t get this" "This is stupid" or total silence',
  },
  {
    key: 'curiosity',
    label: 'Curiosity',
    color: '#8B5CF6',
    range: '0.0 shut down — 1.0 exploring',
    signals: ['Tangential questions', 'Voluntary deep-dives', '"What if..." framing'],
    low: 'Only engages with direct prompts, no exploration',
    high: 'Asks "why", explores tangents, makes connections',
  },
  {
    key: 'cognitive_load',
    label: 'Cognitive Load',
    color: '#F97316',
    range: '0.0 comfortable — 1.0 overwhelmed',
    signals: ['Error rate spikes', 'Requests for repetition', 'Confusion markers'],
    low: 'Processes new info smoothly, builds on concepts',
    high: '"Wait, what?" "Can you say that again?" or errors on previously mastered material',
  },
];

const COMPOSITE_SCORES = [
  {
    name: 'Flow Score',
    formula: '(engagement + confidence + curiosity - frustration - load×0.5) ÷ 3.5',
    description: 'How close the student is to an optimal learning state. High flow means they\'re challenged but not overwhelmed — the sweet spot where deep learning happens.',
    icon: '✨',
    color: '#EEAB3D',
  },
  {
    name: 'Dropout Risk',
    formula: 'frustration×0.4 + (1-engagement)×0.3 + load×0.3',
    description: 'Probability the student will disengage. When this crosses 0.5, the system shifts from teaching to emotional support and de-escalation.',
    icon: '⚠️',
    color: '#EF4444',
  },
  {
    name: 'Challenge Readiness',
    formula: '(confidence×0.4 + engagement×0.3 + curiosity×0.3) × (1-frustration)',
    description: 'Whether the student can handle harder content. High readiness triggers deeper questions, critical thinking prompts, and nuance.',
    icon: '🎯',
    color: '#3B82F6',
  },
];

const STRATEGIES = [
  {
    trigger: 'Frustration > 0.6',
    status: 'Needs Support',
    color: '#EF4444',
    actions: ['Validate feelings without probing', 'Simplify to micro-steps', 'Offer modality choice (visual/story/bullets)', 'Remove time pressure'],
  },
  {
    trigger: 'Engagement < 0.3',
    status: 'Disengaging',
    color: '#EEAB3D',
    actions: ['Don\'t push — low engagement may be protective', 'Offer a completely different angle', 'Bridge to student interests', 'Gentle check-in: "How are you feeling about this?"'],
  },
  {
    trigger: 'Cognitive Load > 0.7',
    status: 'Overwhelmed',
    color: '#F97316',
    actions: ['Student may be emotionally flooded, not confused', 'Drastically reduce complexity', 'Normalize struggle', 'Offer to pause and return later'],
  },
  {
    trigger: 'Confidence > 0.7 & Frustration < 0.3',
    status: 'Ready for Challenge',
    color: '#3B82F6',
    actions: ['Deepen with critical thinking', 'Introduce multiple perspectives', 'Add primary sources and nuance', 'Encourage student to form own interpretations'],
  },
];

export default function EmotionalModelShowcase({ onTryIt }: { onTryIt: () => void }) {
  return (
    <section className="pb-20">
      {/* Section header */}
      <div className="mb-10">
        <h3 className="text-3xl font-heading font-bold text-foreground mb-2">The 5-Dimension Emotional Model</h3>
        <p className="text-sm text-foreground/50 max-w-2xl leading-relaxed">
          Every student message is analyzed across five emotional dimensions in real-time. The model doesn&apos;t just detect feelings — it drives every content decision the system makes.
        </p>
      </div>

      {/* Dimension cards */}
      <div className="space-y-3 mb-12">
        {DIMENSIONS.map((dim, i) => (
          <div
            key={dim.key}
            className="animate-slide-up glass rounded-2xl p-5 card-hover"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Gauge indicator */}
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${dim.color}12` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dim.color, boxShadow: `0 0 10px ${dim.color}50` }} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <h4 className="font-heading font-bold text-foreground">{dim.label}</h4>
                  <span className="text-[10px] text-foreground/30 font-mono">{dim.range}</span>
                </div>

                {/* Signal pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {dim.signals.map((signal) => (
                    <span key={signal} className="text-[10px] px-2.5 py-1 rounded-full bg-ice/40 text-foreground/50 font-medium">
                      {signal}
                    </span>
                  ))}
                </div>

                {/* Low vs High */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-xs">
                    <span className="font-semibold text-foreground/40 uppercase tracking-wider text-[9px]">Low</span>
                    <p className="text-foreground/55 mt-0.5 leading-relaxed">{dim.low}</p>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[9px]" style={{ color: dim.color }}>High</span>
                    <p className="text-foreground/55 mt-0.5 leading-relaxed">{dim.high}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Composite scores */}
      <div className="mb-12">
        <h4 className="text-[10px] font-bold text-foreground/35 uppercase tracking-[0.2em] mb-4 font-heading">
          Derived Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPOSITE_SCORES.map((score, i) => (
            <div
              key={score.name}
              className="animate-scale-in glass rounded-2xl p-5 card-hover"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xl">{score.icon}</span>
                <h5 className="font-heading font-bold text-sm text-foreground">{score.name}</h5>
              </div>
              <div className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-foreground/[0.03] text-foreground/40 mb-3 leading-relaxed">
                {score.formula}
              </div>
              <p className="text-xs text-foreground/55 leading-relaxed">{score.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptation strategy matrix */}
      <div className="mb-12">
        <h4 className="text-[10px] font-bold text-foreground/35 uppercase tracking-[0.2em] mb-4 font-heading">
          Adaptation Strategy Matrix
        </h4>
        <p className="text-xs text-foreground/40 mb-5 max-w-xl">
          The emotional state directly determines teaching strategy. These aren&apos;t suggestions — the system automatically shifts behavior.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STRATEGIES.map((strat, i) => (
            <div
              key={strat.trigger}
              className="animate-slide-up glass rounded-2xl overflow-hidden card-hover"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/10" style={{ background: `linear-gradient(135deg, ${strat.color}08, transparent)` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: strat.color }} />
                <span className="text-xs font-heading font-bold uppercase tracking-wider" style={{ color: strat.color }}>{strat.status}</span>
                <span className="ml-auto text-[10px] font-mono text-foreground/30">{strat.trigger}</span>
              </div>
              <div className="p-5">
                <ul className="space-y-2">
                  {strat.actions.map((action) => (
                    <li key={action} className="flex items-start gap-2 text-xs text-foreground/60 leading-relaxed">
                      <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: strat.color }} />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onTryIt}
          className="btn-primary shimmer px-10 py-4 text-base font-heading inline-flex items-center gap-2.5 rounded-2xl"
        >
          See it in action
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </section>
  );
}
