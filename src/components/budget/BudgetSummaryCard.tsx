'use client';
import { Badge } from '@/components/ui/badge';
import { formatCrore } from '@/lib/utils';
import type { BudgetOutput } from '@/types/budget';

const FEASIBILITY: Record<string, { badge: string; label: string }> = {
  feasible:    { badge: 'border-[var(--accent-green)]/40 text-[var(--accent-green)] bg-[var(--accent-green-muted)]', label: 'Feasible' },
  stressed:    { badge: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10', label: 'Stressed' },
  infeasible:  { badge: 'border-[var(--accent-red)]/40 text-[var(--accent-red)] bg-[var(--accent-red)]/10', label: 'Infeasible' },
};

function StatItem({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p className="text-[var(--text-tertiary)] text-xs mb-0.5">{label}</p>
      <p className={`font-semibold text-sm tabular-nums ${accent ?? 'text-[var(--text-primary)]'}`}>{value}</p>
    </div>
  );
}

export function BudgetSummaryCard({ budget }: { budget: BudgetOutput }) {
  const { totals, feasibilityAssessment } = budget;
  const f = FEASIBILITY[feasibilityAssessment] ?? FEASIBILITY.feasible;

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider">Budget 2026–2047</p>
        <Badge variant="outline" className={`text-xs ${f.badge}`}>
          {f.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <StatItem label="Total outlay" value={formatCrore(totals.totalOutlayCrore)} />
        <StatItem label="Peak year spend" value={formatCrore(totals.peakYearOutlay)} />
        <StatItem label="Procurement" value={formatCrore(totals.totalProcurementCrore)} accent="text-[var(--brand)]" />
        <StatItem label="Maintenance" value={formatCrore(totals.totalMaintenanceCrore)} accent="text-[var(--accent-blue)]" />
        <StatItem label="Avg annual" value={formatCrore(totals.averageAnnualOutlay)} />
        <StatItem label="Peak year" value={String(totals.peakYear)} />
      </div>
    </div>
  );
}
