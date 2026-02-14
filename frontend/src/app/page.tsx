'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CurriculumUpload from '@/components/CurriculumUpload';
import { createDemoSession, createTherapistSession } from '@/lib/demo';
import { SAMPLES } from '@/lib/samples';
import { Curriculum } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);
  const [showManualUpload, setShowManualUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [targetTab, setTargetTab] = useState<'chat' | 'remix'>('chat');

  const handleUploadComplete = (newSessionId: string, newCurriculum: Curriculum) => {
    setCurriculum(newCurriculum);
    setSessionId(newSessionId);
  };

  const handleStartLearning = () => {
    if (sessionId) router.push(`/session/${sessionId}?tab=${targetTab}`);
  };

  const handleDrMindhacker = () => {
    const res = createTherapistSession();
    router.push(`/session/${res.session_id}`);
  };

  const handleSamplePick = (sample: typeof SAMPLES[number]) => {
    setIsLoading(true);
    setError('');
    try {
      const res = createDemoSession(sample.content, sample.subject);
      setCurriculum(res.curriculum);
      setSessionId(res.session_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse curriculum');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh relative overflow-hidden">
      <div className="orb orb-amber animate-float-slow" style={{ top: '-5%', left: '5%', width: '600px', height: '600px' }} />
      <div className="orb orb-ice animate-float-medium" style={{ top: '15%', right: '-8%', width: '500px', height: '500px' }} />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center glow-amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.4 4 8l1.2 1.2a2 2 0 0 0 2.8 0h0a2 2 0 0 0 0-2.8" />
                <path d="M12 2a8 8 0 0 1 8 8c0 3.4-2.1 6.4-4 8l-1.2 1.2a2 2 0 0 1-2.8 0" />
                <circle cx="12" cy="10" r="2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">MindHacker</h1>
              <p className="text-[11px] text-ice-dark font-medium tracking-wide">Emotionally Intelligent Learning</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6">
        {/* ── Hero ── */}
        <section className="pt-12 pb-8 text-center">
          <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-xs font-semibold tracking-wide uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-status-blink" />
            <span className="gradient-text-static">5 AI Agents &middot; Real-time Adaptation &middot; Trauma Informed</span>
          </div>
          <h2 className="animate-slide-up text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4 tracking-tight leading-[1.1]" style={{ animationDelay: '60ms' }}>
            Three ways to{' '}
            <span className="gradient-text">hack your mind</span>
          </h2>
          <p className="animate-slide-up text-base text-foreground/45 max-w-2xl mx-auto leading-relaxed mb-2" style={{ animationDelay: '120ms' }}>
            Talk through personal dilemmas, get tutored on any subject, or remix curriculum into creative formats — all with emotionally adaptive AI.
          </p>
        </section>

        {/* ══════════════════════════════════════════════
            THREE FEATURE CARDS
           ══════════════════════════════════════════════ */}
        <section className="animate-slide-up pb-10" style={{ animationDelay: '200ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Left — Dr. Mindhacker */}
            <div className="glass-strong rounded-3xl p-8 card-hover flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber/20 to-amber/5 flex items-center justify-center mb-5 glow-amber">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EEAB3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.4 4 8l1.2 1.2a2 2 0 0 0 2.8 0h0a2 2 0 0 0 0-2.8" />
                  <path d="M12 2a8 8 0 0 1 8 8c0 3.4-2.1 6.4-4 8l-1.2 1.2a2 2 0 0 1-2.8 0" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">Dr. Mindhacker</h3>
              <p className="text-sm text-foreground/40 leading-relaxed mb-6 flex-1">
                Your AI therapist & coach. Talk through personal dilemmas, get emotional support, and build self-awareness — no curriculum needed.
              </p>
              <button
                onClick={handleDrMindhacker}
                className="w-full py-3 rounded-2xl text-sm font-heading font-semibold bg-gradient-to-r from-amber/15 to-amber/5 text-amber border border-amber/20 hover:from-amber/25 hover:to-amber/10 hover:border-amber/40 transition-all hover:shadow-md cursor-pointer"
              >
                Start talking
                <svg className="inline ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>

            {/* Middle — Courseware Chat */}
            <div className="glass-strong rounded-3xl p-8 card-hover flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ice/30 to-ice/10 flex items-center justify-center mb-5" style={{ boxShadow: '0 0 20px rgba(168,196,207,0.3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7BA7B5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <line x1="8" y1="7" x2="16" y2="7" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">Courseware Chat</h3>
              <p className="text-sm text-foreground/40 leading-relaxed mb-6 flex-1">
                Upload curriculum material and get tutored with emotional adaptation. The AI reshapes content to match your learning state.
              </p>
              <button
                onClick={() => { setShowUpload(true); setTargetTab('chat'); }}
                className="w-full py-3 rounded-2xl text-sm font-heading font-semibold bg-gradient-to-r from-ice/20 to-ice/5 text-ice-dark border border-ice/30 hover:from-ice/30 hover:to-ice/15 hover:border-ice/50 transition-all hover:shadow-md cursor-pointer"
              >
                Choose curriculum
                <svg className="inline ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>

            {/* Right — Remixer */}
            <div className="glass-strong rounded-3xl p-8 card-hover flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400/20 to-purple-400/5 flex items-center justify-center mb-5" style={{ boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3h5v5" /><path d="M8 3H3v5" />
                  <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" /><path d="m15 9 6-6" />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">Remixer</h3>
              <p className="text-sm text-foreground/40 leading-relaxed mb-6 flex-1">
                Upload curriculum, then personalize and remix modules into creative formats — stories, quizzes, study guides, and more.
              </p>
              <button
                onClick={() => { setShowUpload(true); setTargetTab('remix'); }}
                className="w-full py-3 rounded-2xl text-sm font-heading font-semibold bg-gradient-to-r from-purple-400/15 to-purple-400/5 text-purple-500 border border-purple-400/20 hover:from-purple-400/25 hover:to-purple-400/10 hover:border-purple-400/40 transition-all hover:shadow-md cursor-pointer"
              >
                Choose curriculum
                <svg className="inline ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
          </div>
        </section>

        {/* ── CTA / Upload section ── */}
        <section className="pb-20">
          {/* Sample picker — shown when showUpload is true and no curriculum parsed yet */}
          {showUpload && !curriculum && !showManualUpload && (
            <div className="max-w-4xl mx-auto animate-slide-up">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Pick a curriculum
                </h3>
                <p className="text-sm text-foreground/40">
                  Choose a sample below, or upload your own material.
                </p>
              </div>

              {/* Sample grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSamplePick(sample)}
                    disabled={isLoading}
                    className="glass rounded-2xl p-5 text-left card-hover transition-all hover:glass-strong group cursor-pointer disabled:opacity-50"
                  >
                    <span className="text-2xl block mb-2">{sample.emoji}</span>
                    <h4 className="font-heading font-bold text-sm text-foreground mb-1 group-hover:text-amber transition-colors">{sample.title}</h4>
                    <p className="text-[11px] text-foreground/40 leading-relaxed">{sample.description}</p>
                  </button>
                ))}
              </div>

              {/* Upload your own */}
              <div className="text-center">
                <button
                  onClick={() => setShowManualUpload(true)}
                  className="text-sm text-amber hover:text-amber-dark font-medium underline underline-offset-4 decoration-amber/30 hover:decoration-amber/60 transition-all cursor-pointer"
                >
                  Upload your own curriculum instead
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 glass border border-red-200/50 rounded-2xl text-sm text-red-600 text-center">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Manual upload — shown after clicking "Upload your own" */}
          {showUpload && !curriculum && showManualUpload && (
            <div className="max-w-2xl mx-auto animate-slide-up">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-1">Upload your curriculum</h3>
                <p className="text-sm text-foreground/40">Paste a lesson plan, unit outline, or worksheet.</p>
              </div>
              <CurriculumUpload onUploadComplete={handleUploadComplete} isLoading={isLoading} setIsLoading={setIsLoading} setError={setError} />
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowManualUpload(false)}
                  className="text-sm text-amber hover:text-amber-dark font-medium underline underline-offset-4 decoration-amber/30 hover:decoration-amber/60 transition-all cursor-pointer"
                >
                  Back to sample curricula
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 glass border border-red-200/50 rounded-2xl text-sm text-red-600 text-center">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Curriculum review — shown after picking a sample or uploading */}
          {curriculum && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="animate-scale-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-amber/20 text-sm font-medium mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EEAB3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 15l2 2 4-4" /></svg>
                  <span className="gradient-text-static">Curriculum parsed</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-1">{curriculum.subject || 'Your Curriculum'}</h2>
                <p className="text-sm text-foreground/40">{curriculum.nodes.length} modules ready</p>
              </div>
              <div className="space-y-2 mb-6">
                {curriculum.nodes.map((node, i) => (
                  <div key={node.id} className="animate-slide-up flex items-start gap-3 p-3.5 glass rounded-xl" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber/15 to-amber/5 text-amber font-heading font-bold text-[10px] flex items-center justify-center shrink-0">{i + 1}</div>
                    <div>
                      <h4 className="font-heading font-semibold text-foreground text-sm">{node.title}</h4>
                      <p className="text-[11px] text-foreground/40 mt-0.5">{node.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleStartLearning}
                className="w-full py-3.5 btn-primary shimmer rounded-2xl flex items-center justify-center gap-2 text-base font-heading"
              >
                Launch Session
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
