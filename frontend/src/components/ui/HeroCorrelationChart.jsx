import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import Card from './Card';
import Badge from './Badge';

/**
 * Custom Dot Marker for Driver Mood:
 * - Calm: Gray (#71717a)
 * - Tired: Amber (#f59e0b)
 * - Stressed: Red (#f43f5e)
 */
const RenderMoodDot = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;

  const mood = payload?.mood || 'Calm';
  const isStressLap = payload?.isStressLap;

  if (mood === 'Stressed' || isStressLap) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={7} fill="#f43f5e" fillOpacity={0.25} className="animate-ping" />
        <circle cx={cx} cy={cy} r={4.5} fill="#f43f5e" stroke="#ffffff" strokeWidth={1.5} />
      </g>
    );
  }

  if (mood === 'Tired') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill="#f59e0b" stroke="#ffffff" strokeWidth={1} />
      </g>
    );
  }

  return (
    <circle cx={cx} cy={cy} r={3} fill="#71717a" stroke="#ffffff" strokeWidth={1} />
  );
};

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const mood = data.mood || 'Calm';
    const isStress = mood === 'Stressed' || data.isStressLap;
    const isTired = mood === 'Tired';

    return (
      <div className="p-3 bg-zinc-950 text-white dark:bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl text-xs space-y-2 backdrop-blur-md min-w-[200px]">
        <div className="font-semibold flex justify-between items-center border-b border-zinc-800 pb-1.5">
          <span className="text-zinc-400">Lap {label}</span>
          <span className="font-mono font-bold text-white text-sm">{data.lapTime}</span>
        </div>

        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between text-zinc-400">
            <span>5-Lap Moving Avg:</span>
            <span className="font-mono text-zinc-200">{data.movingAvg}</span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-zinc-800/80">
            <span className="text-zinc-400">Driver Mood:</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                isStress
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : isTired
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isStress ? 'bg-rose-500 animate-pulse' : isTired ? 'bg-amber-400' : 'bg-zinc-400'
                }`}
              />
              {mood}
            </span>
          </div>

          {data.stressEvent && (
            <div className="text-[10px] text-rose-400 font-medium pt-1 flex items-center gap-1 border-t border-zinc-800/60">
              <span>⚠</span>
              <span>{data.stressEvent}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const HeroCorrelationChart = ({ correlation, lapStats }) => {
  const chartData = correlation?.chartData || lapStats?.chartData || [];
  const stressLap = correlation?.stressLap || 18;
  const degradationStr = correlation?.performanceDegradationStr || '+1.58 s/lap';

  return (
    <Card
      title="Lap Time & Driver Stress Correlation Curve"
      subtitle="Actual lap pace overlaid with mood state markers and stress event trigger point"
      action={
        <div className="flex items-center gap-1.5">
          <Badge variant="white" size="sm">
            Telemetry Fusion
          </Badge>
        </div>
      }
    >
      <div className="space-y-3">
        {/* Mood Legend Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-1">
          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#71717a] inline-block" />
              Calm
            </span>
            <span className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block" />
              Tired
            </span>
            <span className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] inline-block animate-pulse" />
              Stressed
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 font-mono">
            Degradation: <strong className="text-rose-500">{degradationStr}</strong>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-64 sm:h-72 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="currentColor" />
              <XAxis
                dataKey="lap"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `L${val}`}
              />
              <YAxis
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `${val}s`}
                width={45}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="plainline"
                formatter={(value) => (
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    {value === 'lapTimeSec' ? 'Lap Time (s)' : '5-Lap Moving Average (s)'}
                  </span>
                )}
              />

              {/* Vertical Reference Marker at Stress Lap */}
              {stressLap && (
                <ReferenceLine
                  x={stressLap}
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: `⚡ Lap ${stressLap}: Stress Event`,
                    position: 'insideTopLeft',
                    fill: '#f43f5e',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
              )}

              {/* Lap Time Line with Mood Dots */}
              <Line
                type="monotone"
                dataKey="lapTimeSec"
                stroke="#18181b"
                strokeWidth={2.5}
                dot={<RenderMoodDot />}
                activeDot={{ r: 6, fill: '#f43f5e', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-in-out"
                className="dark:stroke-white"
              />

              {/* 5-Lap Moving Average Line */}
              <Line
                type="monotone"
                dataKey="movingAvgSec"
                stroke="#f43f5e"
                strokeWidth={1.8}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default HeroCorrelationChart;
