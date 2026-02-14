'use client';

import { EmotionalState } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const LINES = [
  { key: 'engagement', color: '#EEAB3D', label: 'Engagement' },
  { key: 'confidence', color: '#22C55E', label: 'Confidence' },
  { key: 'frustration', color: '#EF4444', label: 'Frustration' },
  { key: 'curiosity', color: '#8B5CF6', label: 'Curiosity' },
  { key: 'cognitive_load', color: '#F97316', label: 'Load' },
] as const;

export default function EmotionTimeline({
  history,
}: {
  history: EmotionalState[];
}) {
  if (history.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center text-xs text-foreground/30 font-medium">
        Timeline appears after a few messages
      </div>
    );
  }

  const data = history.map((s, i) => ({
    idx: i + 1,
    ...s,
  }));

  return (
    <div className="h-36">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
          <XAxis
            dataKey="idx"
            tick={{ fontSize: 10, fill: '#A8C4CF' }}
            axisLine={{ stroke: 'rgba(211, 229, 235, 0.3)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 1]}
            tick={{ fontSize: 10, fill: '#A8C4CF' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(211, 229, 235, 0.4)',
              borderRadius: '12px',
              fontSize: '11px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
            formatter={(value) => [(value as number).toFixed(2)]}
          />
          {LINES.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              name={line.label}
              strokeOpacity={0.85}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
