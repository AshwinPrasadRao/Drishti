'use client';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceDot,
} from 'recharts';
import type { BudgetOutput } from '@/types/budget';
import { formatCrore } from '@/lib/utils';

export function BudgetAreaChart({ budget }: { budget: BudgetOutput }) {
  const data = budget.annualEntries.map((e) => ({
    year: e.year,
    Procurement: Math.round(e.procurementSpend),
    Maintenance: Math.round(e.maintenanceSpend),
    Personnel: Math.round(e.personnelCrore),
    pctGDP: e.defenceAsPercentGDP ? Number(e.defenceAsPercentGDP.toFixed(2)) : 0,
    cpc: e.cpcEffectiveThisYear,
  }));

  const cpcYears = data.filter((d) => d.cpc);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="procGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.32} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="maintGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="persGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: '#c4c4c4', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          interval={2}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={(v) => formatCrore(v)}
          tick={{ fill: '#c4c4c4', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={72}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: '#c4c4c4', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={42}
          domain={[0, 'dataMax + 0.5']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#181818',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#ededed', fontWeight: 600, marginBottom: '4px' }}
          itemStyle={{ color: '#e5e5e5' }}
          formatter={(value, name) => {
            if (name === '% GDP') return [`${value}%`, name];
            return [formatCrore(Number(value)), String(name)];
          }}
        />
        <Legend
          wrapperStyle={{ color: '#e5e5e5', fontSize: 12, paddingTop: '8px' }}
          iconType="circle"
          iconSize={6}
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="Personnel"
          stackId="1"
          stroke="#fbbf24"
          fill="url(#persGrad)"
          strokeWidth={1.5}
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="Maintenance"
          stackId="1"
          stroke="#60a5fa"
          fill="url(#maintGrad)"
          strokeWidth={1.5}
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="Procurement"
          stackId="1"
          stroke="#f97316"
          fill="url(#procGrad)"
          strokeWidth={1.5}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="pctGDP"
          name="% GDP"
          stroke="#ededed"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          dot={false}
          activeDot={{ r: 3 }}
        />
        {cpcYears.map((d) => (
          <ReferenceDot
            key={d.year}
            yAxisId="right"
            x={d.year}
            y={d.pctGDP}
            r={4}
            fill="#fbbf24"
            stroke="#0d0d0d"
            strokeWidth={1.5}
            label={{ value: `${d.cpc}th CPC`, position: 'top', fill: '#fbbf24', fontSize: 12, fontWeight: 600 }}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
