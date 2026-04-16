'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { BudgetOutput } from '@/types/budget';
import { formatCrore } from '@/lib/utils';

export function BudgetAreaChart({ budget }: { budget: BudgetOutput }) {
  const data = budget.annualEntries.map((e) => ({
    year: e.year,
    Procurement: Math.round(e.procurementSpend),
    Maintenance: Math.round(e.maintenanceSpend),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="procGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="maintGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: '#555555', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis
          tickFormatter={(v) => formatCrore(v)}
          tick={{ fill: '#555555', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          width={72}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#181818',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#ededed', fontWeight: 600, marginBottom: '4px' }}
          itemStyle={{ color: '#999' }}
          formatter={(value, name) => [formatCrore(Number(value)), String(name)]}
        />
        <Legend
          wrapperStyle={{ color: '#555555', fontSize: 11, paddingTop: '8px' }}
          iconType="circle"
          iconSize={6}
        />
        <Area
          type="monotone"
          dataKey="Procurement"
          stackId="1"
          stroke="#f97316"
          fill="url(#procGrad)"
          strokeWidth={1.5}
        />
        <Area
          type="monotone"
          dataKey="Maintenance"
          stackId="1"
          stroke="#60a5fa"
          fill="url(#maintGrad)"
          strokeWidth={1.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
