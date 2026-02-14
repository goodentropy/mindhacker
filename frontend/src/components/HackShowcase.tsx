'use client';

import { useState } from 'react';

interface Hack {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  dataSource: string;
  before: { label: string; content: string };
  after: { label: string; content: string };
  howItWorks: string[];
}

const HACKS: Hack[] = [
  {
    id: 'remix',
    name: 'The Remix',
    tagline: 'Turn any worksheet into their passion project',
    icon: '🎵',
    color: 'bg-purple-500',
    gradient: 'from-purple-500/15 to-purple-600/5',
    description:
      'MindHacker reads a student\'s Canvas submissions, email interests, and Spotify listening habits to figure out what makes them tick. Then it rewrites the assignment in their language.',
    dataSource: 'Canvas grades show Marcus aces music theory but struggles with algebra. His emails mention his SoundCloud. Agent connects the dots.',
    before: {
      label: 'Algebra Worksheet',
      content:
        'Solve for x:\n1) 3x + 7 = 22\n2) 2(x - 4) = 10\n3) Graph y = 2x + 1\n4) Find the slope between (2,5) and (6,13)',
    },
    after: {
      label: 'Beat Engineering Project',
      content:
        '🎵 Producer Math: Build Your Beat\n\nYour track is 120 BPM. You want a vocal chop to hit every 3 beats with a 7-beat intro delay.\n\n1) Write the equation: when does the chop first land? (3x + 7 = ?)\n2) Your bass hits twice per bar minus 4 rests. If you have 10 bass hits, write and solve the equation.\n3) Plot your volume automation: y = 2x + 1 where x is bar number.\n4) Your pitch shifts from (bar 2, note 5) to (bar 6, note 13). What\'s the pitch slope?\n\n🎧 Same math. Your world.',
    },
    howItWorks: [
      'Emotional Assessor detects low engagement + high capability in Canvas data',
      'Content Adapter reads student interests from email/LMS activity',
      'Curriculum Architect preserves all learning objectives from original worksheet',
      'Orchestrator outputs transformed assignment that hits same standards',
    ],
  },
  {
    id: 'shield',
    name: 'The Shield',
    tagline: 'Navigate sensitive content without triggering students',
    icon: '🛡️',
    color: 'bg-amber',
    gradient: 'from-amber/15 to-amber-dark/5',
    description:
      'Some curriculum hits different when you\'ve lived it. MindHacker detects when content might be triggering and reframes it — keeping the learning objectives intact while protecting emotional safety.',
    dataSource: 'Canvas counselor notes flag that Jaylen recently experienced family displacement. The Civil War unit covers refugees and displacement.',
    before: {
      label: 'History Textbook',
      content:
        'As Sherman\'s army advanced, thousands of families were forced from their homes. Children were separated from parents. Entire communities were destroyed overnight. Refugees walked for days without food, shelter, or any idea where they would end up.',
    },
    after: {
      label: 'Adapted Lesson',
      content:
        '📋 Community Resilience During the Civil War\n\nWhen the war disrupted communities, people found remarkable ways to rebuild and support each other.\n\n**Key question:** What strategies did communities use to stay connected during upheaval?\n\n• Mutual aid networks formed among displaced families\n• Churches and organizations created support systems\n• People documented their experiences to preserve their stories\n\n💡 *We can explore this at whatever level feels right. Want to look at the community organizing angle, or would you prefer to focus on the policy response?*\n\n↩️ You\'re in control of how deep we go here.',
    },
    howItWorks: [
      'Emotional Assessor cross-references topic with student profile flags',
      'Content Adapter reframes from victimhood narrative to agency/resilience',
      'Orchestrator adds choice points so student controls depth',
      'Assessment Generator avoids questions requiring students to imagine displacement',
    ],
  },
  {
    id: 'bridge',
    name: 'The Bridge',
    tagline: 'Connect curriculum to what\'s already in their world',
    icon: '🌉',
    color: 'bg-blue-500',
    gradient: 'from-blue-500/15 to-blue-600/5',
    description:
      'Students don\'t hate learning — they hate irrelevance. MindHacker scans Canvas discussions, email threads, and recent assignments to find natural bridges between what they care about and what they need to learn.',
    dataSource: 'Canvas shows Priya is active in debate club and Model UN. Her emails reference climate activism. She\'s currently in a chemistry unit on molecular bonds.',
    before: {
      label: 'Chemistry Textbook',
      content:
        'Chapter 7: Chemical Bonds\n\nIonic bonds form when one atom transfers electrons to another. Covalent bonds form when atoms share electrons. Bond strength is measured in kJ/mol. Complete the worksheet: identify the bond type in each molecule.',
    },
    after: {
      label: 'Climate Policy Lab',
      content:
        '🌍 The Chemistry of Climate Policy\n\nYou\'re drafting a UN resolution on carbon capture. But first, you need to understand what you\'re capturing.\n\n**CO₂**: Why is this covalent bond so stable? (Hint: that stability is why it stays in our atmosphere for centuries)\n\n**CaCO₃**: Limestone is a potential carbon sink. What mix of ionic and covalent bonds makes it work?\n\n🎤 *Debate prep*: Your opponent says "just break the CO₂ bonds." Using bond energy data (799 kJ/mol for C=O), explain why that argument oversimplifies the problem.\n\n📝 Same standards. Real stakes.',
    },
    howItWorks: [
      'Curriculum Architect identifies learning objectives: bond types, bond energy, molecular structure',
      'Content Adapter reads student interest profile from Canvas + email activity',
      'Orchestrator merges subject passion with chemistry standards',
      'Assessment Generator creates debate-style questions matching student\'s competitive nature',
    ],
  },
  {
    id: 'mirror',
    name: 'The Mirror',
    tagline: 'Show teachers what they can\'t see',
    icon: '🪞',
    color: 'bg-green-500',
    gradient: 'from-green-500/15 to-green-600/5',
    description:
      'Teachers can\'t read 30 minds at once. MindHacker gives them a real-time emotional dashboard across the class — who\'s struggling silently, who\'s bored and needs a challenge, who\'s about to check out.',
    dataSource: 'Aggregated emotional state data from all student sessions in the class. No individual trauma details shared — only actionable patterns.',
    before: {
      label: 'What the teacher sees',
      content:
        '30 students in desks\n14 looking at their phones\n3 with heads down\n8 looking at the board\n5 talking to each other\n\n"Is anyone paying attention?"',
    },
    after: {
      label: 'MindHacker Teacher Dashboard',
      content:
        '📊 Period 3 — American History — Live\n\n🟢 12 students: High engagement, ready for challenge\n🟡 8 students: Moderate — could use a hook or activity shift\n🟠 6 students: Low engagement — content may feel irrelevant\n🔴 4 students: Elevated stress signals — topic may be activating\n\n💡 Suggested pivot: The 🔴 cluster activated during the displacement section. Consider switching to the "community resilience" framing for the next 10 minutes.\n\n📈 Trend: Engagement peaks during discussion segments, drops during textbook reading. Consider flipping to Socratic method.',
    },
    howItWorks: [
      'Emotional Assessor runs continuously across all active student sessions',
      'Orchestrator aggregates class-level patterns without exposing individual data',
      'Content Adapter suggests real-time pivots to the teacher',
      'Assessment Generator can create differentiated exit tickets by engagement cluster',
    ],
  },
  {
    id: 'scaffold',
    name: 'The Scaffold',
    tagline: 'Meet them exactly where they are',
    icon: '🪜',
    color: 'bg-orange-500',
    gradient: 'from-orange-500/15 to-orange-600/5',
    description:
      'When a student is drowning, more content isn\'t the answer. MindHacker detects cognitive overload and automatically breaks things down — way down — until it finds solid ground to build from.',
    dataSource: 'Canvas shows Deshawn failed the last 3 quizzes. His messages are getting shorter. Emotional Assessor flags rising frustration + dropping confidence.',
    before: {
      label: 'What the student gets',
      content:
        'Read Chapter 12 and answer questions 1-15.\n\nReminder: Test on Friday covering chapters 10-12.\n\nYou are behind. Please see me after class.',
    },
    after: {
      label: 'MindHacker Intervention',
      content:
        '💪 Hey — I noticed this unit\'s been tough. That\'s real, and it\'s okay.\n\nLet\'s forget chapters 10-12 for a second. I want to find out what you DO know.\n\n**Quick check** (no grade, just us):\n✅ Can you tell me one thing about [topic] in your own words?\n\nAwesome. We\'re going to build from right there.\n\n📦 *I broke the next section into 3 small pieces. You pick which one to start with:*\nA) The visual version (diagrams + colors)\nB) The story version (real-world example)\nC) The quick-hits version (bullet points, no fluff)\n\n🎯 No test Friday for you — we\'ll get there when it makes sense.',
    },
    howItWorks: [
      'Emotional Assessor detects frustration spiral from message patterns + Canvas grades',
      'Content Adapter breaks curriculum into micro-steps at student\'s actual level',
      'Orchestrator offers modality choice (visual/narrative/concise) to restore agency',
      'Assessment Generator creates low-stakes formative checks instead of summative tests',
    ],
  },
];

export default function HackShowcase({ onTryIt }: { onTryIt: () => void }) {
  const [activeHack, setActiveHack] = useState(HACKS[0].id);
  const hack = HACKS.find((h) => h.id === activeHack)!;

  return (
    <section className="pb-20">
      {/* Hack selector tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {HACKS.map((h) => (
          <button
            key={h.id}
            onClick={() => setActiveHack(h.id)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${
              activeHack === h.id
                ? 'glass-strong glow-amber shadow-lg text-foreground'
                : 'glass text-foreground/50 hover:text-foreground/80 hover:shadow-md'
            }`}
          >
            <span className="text-lg">{h.icon}</span>
            {h.name}
          </button>
        ))}
      </div>

      {/* Active hack display */}
      <div className="animate-scale-in" key={hack.id}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${hack.gradient} flex items-center justify-center text-2xl shadow-lg`}>
              {hack.icon}
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-foreground">{hack.name}</h3>
              <p className="text-sm text-foreground/45 font-medium">{hack.tagline}</p>
            </div>
          </div>
          <p className="text-sm text-foreground/65 leading-relaxed mt-4 max-w-2xl">
            {hack.description}
          </p>
        </div>

        {/* Data source callout */}
        <div className="flex items-start gap-3 p-5 glass rounded-2xl mb-8 gradient-border card-hover">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber/15 to-amber/5 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-sm">📧</span>
          </div>
          <div>
            <div className="text-[10px] font-bold gradient-text-static uppercase tracking-[0.15em] mb-1.5">
              What the agent reads
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">{hack.dataSource}</p>
          </div>
        </div>

        {/* Before / After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Before */}
          <div className="glass rounded-2xl overflow-hidden card-hover">
            <div className="px-5 py-3 border-b border-ice/30 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-red-400/70" />
              <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">{hack.before.label}</span>
            </div>
            <div className="p-5">
              <pre className="text-xs text-foreground/60 whitespace-pre-wrap font-sans leading-relaxed">
                {hack.before.content}
              </pre>
            </div>
          </div>

          {/* After */}
          <div className="glass rounded-2xl overflow-hidden gradient-border card-hover glow-amber">
            <div className="px-5 py-3 border-b border-amber/15 flex items-center gap-2.5 bg-gradient-to-r from-amber/5 to-transparent">
              <div className="w-2 h-2 rounded-full bg-amber animate-glow-pulse" />
              <span className="text-xs font-semibold text-amber-dark uppercase tracking-wider">{hack.after.label}</span>
              <span className="ml-auto text-[9px] gradient-text-static font-bold uppercase tracking-[0.2em]">MindHacked</span>
            </div>
            <div className="p-5">
              <pre className="text-xs text-foreground/75 whitespace-pre-wrap font-sans leading-relaxed">
                {hack.after.content}
              </pre>
            </div>
          </div>
        </div>

        {/* How it works - agent pipeline */}
        <div className="glass rounded-2xl p-6 mb-10">
          <h4 className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-4 font-heading">
            Agent Pipeline
          </h4>
          <div className="space-y-3">
            {hack.howItWorks.map((step, i) => (
              <div
                key={i}
                className="animate-slide-up flex items-start gap-3"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 text-amber text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-heading">
                  {i + 1}
                </div>
                <p className="text-sm text-foreground/65 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onTryIt}
          className="btn-primary shimmer px-10 py-4 text-base font-heading inline-flex items-center gap-2.5 rounded-2xl"
        >
          Try it with your curriculum
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </section>
  );
}
