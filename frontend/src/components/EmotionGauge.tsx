'use client';

import { useEffect, useState } from 'react';

const EMOTION_COLORS: Record<string, string> = {
  engagement: '#EEAB3D',
  confidence: '#22C55E',
  frustration: '#EF4444',
  curiosity: '#8B5CF6',
  cognitive_load: '#F97316',
};

const EMOTION_LABELS: Record<string, string> = {
  engagement: 'Engagement',
  confidence: 'Confidence',
  frustration: 'Frustration',
  curiosity: 'Curiosity',
  cognitive_load: 'Cog. Load',
};

export default function EmotionGauge({
  dimension,
  value,
}: {
  dimension: string;
  value: number;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const color = EMOTION_COLORS[dimension] || '#EEAB3D';
  const label = EMOTION_LABELS[dimension] || dimension;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 50);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - animatedValue * circumference;
  const filterId = `glow-${dimension}`;
  const gradientId = `grad-${dimension}`;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-[76px] h-[76px]">
        <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90">
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke="rgba(211, 229, 235, 0.3)"
            strokeWidth="5"
          />
          {/* Value arc with glow */}
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={`url(#${filterId})`}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-heading font-bold" style={{ color }}>
            {Math.round(animatedValue * 100)}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-semibold text-foreground/50 text-center leading-tight tracking-wide">
        {label}
      </span>
    </div>
  );
}
