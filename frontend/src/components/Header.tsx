'use client';

export default function Header({
  progressPct,
  currentTopic,
}: {
  progressPct?: number;
  currentTopic?: string;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-3 glass-strong border-b border-white/20 relative z-10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center glow-amber">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.4 4 8l1.2 1.2a2 2 0 0 0 2.8 0h0a2 2 0 0 0 0-2.8" />
            <path d="M12 2a8 8 0 0 1 8 8c0 3.4-2.1 6.4-4 8l-1.2 1.2a2 2 0 0 1-2.8 0" />
            <circle cx="12" cy="10" r="2" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-heading font-bold text-foreground tracking-tight">MindHacker</h1>
          {currentTopic && (
            <p className="text-[11px] text-ice-dark font-medium">{currentTopic}</p>
          )}
        </div>
      </div>

      {progressPct !== undefined && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">Progress</span>
          <div className="w-48 h-2.5 bg-ice/40 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{
                width: `${Math.min(100, progressPct)}%`,
                background: 'linear-gradient(90deg, #EEAB3D, #F5CC7A, #EEAB3D)',
                backgroundSize: '200% 100%',
                animation: 'gradient-flow 3s ease-in-out infinite',
                boxShadow: '0 0 12px rgba(238, 171, 61, 0.4)',
              }}
            />
          </div>
          <span className="text-xs font-heading font-bold gradient-text-static min-w-[2.5rem] text-right">
            {Math.round(progressPct)}%
          </span>
        </div>
      )}
    </header>
  );
}
