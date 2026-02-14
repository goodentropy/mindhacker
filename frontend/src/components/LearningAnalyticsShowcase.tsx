'use client';

const ANALYTICS_PIPELINE = [
  {
    stage: 'Collect',
    icon: '📡',
    color: '#8B5CF6',
    description: 'Every interaction generates emotional and learning data',
    details: [
      'Message sentiment and linguistic complexity',
      'Response time and engagement patterns',
      'Error frequency and self-correction rate',
      'Topic avoidance and comfort mapping',
    ],
  },
  {
    stage: 'Model',
    icon: '🧠',
    color: '#EEAB3D',
    description: 'Five specialist agents build a real-time student profile',
    details: [
      '5-dimension emotional state (updated every message)',
      'Composite scores: flow, dropout risk, challenge readiness',
      'Historical emotional trajectory across the session',
      'Content sensitivity mapping per curriculum node',
    ],
  },
  {
    stage: 'Decide',
    icon: '⚡',
    color: '#F97316',
    description: 'The orchestrator chooses the optimal teaching strategy',
    details: [
      'If frustrated: simplify, validate, offer choice',
      'If disengaged: pivot angle, bridge to interests',
      'If overwhelmed: reduce load, normalize struggle',
      'If ready: deepen, add nuance, critical thinking',
    ],
  },
  {
    stage: 'Adapt',
    icon: '🎯',
    color: '#22C55E',
    description: 'Content is reshaped in real-time before the student sees it',
    details: [
      'Complexity level adjusted to emotional state',
      'Sensitive content reframed for emotional safety',
      'Assessment difficulty calibrated to confidence',
      'Pacing dynamically controlled by cognitive load',
    ],
  },
  {
    stage: 'Measure',
    icon: '📈',
    color: '#3B82F6',
    description: 'Outcomes feed back into the model, creating a learning loop',
    details: [
      'Did the adaptation reduce frustration?',
      'Did engagement increase after the pivot?',
      'Are error rates decreasing over time?',
      'Is the student progressing through curriculum nodes?',
    ],
  },
];

const OUTCOMES = [
  {
    metric: 'Dropout Prevention',
    description: 'System detects disengagement signals 2-3 messages before a student would typically give up, allowing preemptive intervention.',
    before: 'Student silently stops participating',
    after: 'System detects rising frustration + dropping engagement and pivots before the student checks out',
    icon: '🛡️',
  },
  {
    metric: 'Emotional Safety',
    description: 'Potentially triggering curriculum content is automatically reframed through structural/systemic lenses, preserving learning objectives while protecting students.',
    before: 'All students get the same graphic content regardless of their emotional state',
    after: 'Content is dynamically reframed: agency-focused narratives, optional depth, always an off-ramp',
    icon: '💚',
  },
  {
    metric: 'Personalized Pacing',
    description: 'Cognitive load monitoring ensures students never receive more complexity than they can process. The system automatically breaks content into smaller steps when needed.',
    before: 'Fixed pacing: Chapter 12, questions 1-15, test on Friday',
    after: 'Dynamic pacing: micro-steps when overwhelmed, deeper dives when ready, assessments calibrated to the individual',
    icon: '⏱️',
  },
  {
    metric: 'Interest Bridging',
    description: 'By connecting curriculum to student interests, engagement increases dramatically. A student who loves music learns algebra through beat production.',
    before: 'Abstract worksheets disconnected from student life',
    after: 'Curriculum remixed through the student\'s own passions and interests',
    icon: '🌉',
  },
];

const DEMO_TIMELINE = [
  { msg: 'Student opens session', engagement: 0.5, frustration: 0.0, action: null },
  { msg: '"Hi, teach me about the Civil War"', engagement: 0.8, frustration: 0.1, action: 'High curiosity detected — deep content delivery' },
  { msg: '"Tell me more about the battles"', engagement: 0.8, frustration: 0.1, action: 'Continued engagement — advancing to detailed content' },
  { msg: '"I don\'t get this at all"', engagement: 0.3, frustration: 0.8, action: 'Frustration spike — switching to scaffolding mode' },
  { msg: 'System: validates + simplifies', engagement: 0.5, frustration: 0.4, action: 'De-escalation successful — frustration decreasing' },
  { msg: '"Oh that makes more sense"', engagement: 0.7, frustration: 0.2, action: 'Recovery detected — gradually increasing complexity' },
];

export default function LearningAnalyticsShowcase({ onTryIt }: { onTryIt: () => void }) {
  return (
    <section className="pb-20">
      {/* Section header */}
      <div className="mb-10">
        <h3 className="text-3xl font-heading font-bold text-foreground mb-2">Learning Analytics Pipeline</h3>
        <p className="text-sm text-foreground/50 max-w-2xl leading-relaxed">
          Every student interaction flows through a five-stage analytics pipeline that continuously improves learning outcomes. This isn&apos;t a static system — it learns and adapts with every message.
        </p>
      </div>

      {/* Pipeline stages */}
      <div className="space-y-4 mb-14">
        {ANALYTICS_PIPELINE.map((stage, i) => (
          <div
            key={stage.stage}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex items-stretch gap-4">
              {/* Stage indicator */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${stage.color}18, ${stage.color}08)`, boxShadow: `0 4px 20px ${stage.color}15` }}
                >
                  {stage.icon}
                </div>
                {i < ANALYTICS_PIPELINE.length - 1 && (
                  <div className="w-[2px] flex-1 my-1 rounded-full" style={{ background: `linear-gradient(to bottom, ${stage.color}30, ${ANALYTICS_PIPELINE[i + 1].color}30)` }} />
                )}
              </div>

              {/* Content */}
              <div className="glass rounded-2xl p-5 flex-1 card-hover">
                <div className="flex items-center gap-2.5 mb-2">
                  <h4 className="font-heading font-bold text-foreground">{stage.stage}</h4>
                  <div className="h-px flex-1 bg-ice/40" />
                  <span className="text-[10px] font-mono text-foreground/25">stage {i + 1}</span>
                </div>
                <p className="text-sm text-foreground/55 mb-3">{stage.description}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {stage.details.map((detail) => (
                    <div key={detail} className="flex items-start gap-2 text-xs text-foreground/45">
                      <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: stage.color }} />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time demo timeline */}
      <div className="mb-14">
        <h4 className="text-[10px] font-bold text-foreground/35 uppercase tracking-[0.2em] mb-2 font-heading">
          Live Session Example
        </h4>
        <p className="text-xs text-foreground/40 mb-5 max-w-xl">
          Watch how emotional metrics change in real-time during a student session and how the system responds.
        </p>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_80px_1fr] gap-0 text-[10px] font-heading font-bold text-foreground/30 uppercase tracking-wider px-5 py-2.5 border-b border-ice/20 bg-ice/10">
            <span>Message</span>
            <span className="text-center">Engage</span>
            <span className="text-center">Frust.</span>
            <span>System Response</span>
          </div>
          {DEMO_TIMELINE.map((step, i) => (
            <div
              key={i}
              className="animate-fade-in-up grid grid-cols-[1fr_80px_80px_1fr] gap-0 items-center px-5 py-3 border-b border-ice/10 last:border-b-0 hover:bg-ice/5 transition-colors"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-xs text-foreground/60 pr-3">{step.msg}</span>
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-full max-w-[50px] h-1.5 bg-ice/30 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${step.engagement * 100}%`, backgroundColor: '#EEAB3D' }} />
                </div>
                <span className="text-[10px] font-mono text-foreground/30 w-6 text-right">{step.engagement.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-full max-w-[50px] h-1.5 bg-ice/30 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${step.frustration * 100}%`, backgroundColor: '#EF4444' }} />
                </div>
                <span className="text-[10px] font-mono text-foreground/30 w-6 text-right">{step.frustration.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-foreground/45 pl-3">
                {step.action ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: step.frustration > 0.5 ? '#EF4444' : step.engagement > 0.6 ? '#22C55E' : '#EEAB3D' }} />
                    {step.action}
                  </span>
                ) : (
                  <span className="text-foreground/20">—</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Outcome improvements */}
      <div className="mb-12">
        <h4 className="text-[10px] font-bold text-foreground/35 uppercase tracking-[0.2em] mb-2 font-heading">
          Outcome Improvements
        </h4>
        <p className="text-xs text-foreground/40 mb-5 max-w-xl">
          How emotional analytics translate to measurable improvements in student experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OUTCOMES.map((outcome, i) => (
            <div
              key={outcome.metric}
              className="animate-scale-in glass rounded-2xl p-5 card-hover"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xl">{outcome.icon}</span>
                <h5 className="font-heading font-bold text-sm text-foreground">{outcome.metric}</h5>
              </div>
              <p className="text-xs text-foreground/50 mb-4 leading-relaxed">{outcome.description}</p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-red-400/60 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground/35 uppercase text-[9px] tracking-wider">Without</span>
                    <p className="text-foreground/50 mt-0.5">{outcome.before}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-amber mt-1 shrink-0" style={{ boxShadow: '0 0 6px rgba(238,171,61,0.4)' }} />
                  <div>
                    <span className="font-semibold text-amber-dark uppercase text-[9px] tracking-wider">With MindHacker</span>
                    <p className="text-foreground/65 mt-0.5">{outcome.after}</p>
                  </div>
                </div>
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
          Try the live demo
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </section>
  );
}
