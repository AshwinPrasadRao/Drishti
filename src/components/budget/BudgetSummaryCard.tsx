'use client';
import { Badge } from '@/components/ui/badge';
import { formatCrore } from '@/lib/utils';
import type { BudgetOutput } from '@/types/budget';

const FEASIBILITY: Record<string, { badge: string; label: string }> = {
  feasible:    { badge: 'border-[var(--accent-green)]/40 text-[var(--accent-green)] bg-[var(--accent-green-muted)]', label: 'Feasible' },
  stressed:    { badge: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10', label: 'Stressed' },
  infeasible:  { badge: 'border-[var(--accent-red)]/40 text-[var(--accent-red)] bg-[var(--accent-red)]/10', label: 'Infeasible' },
};

function StatItem({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div>
      <p className="text-[var(--text-tertiary)] text-xs mb-0.5">{label}</p>
      <p className={`font-semibold text-sm tabular-nums ${accent ?? 'text-[var(--text-primary)]'}`}>{value}</p>
      {sub && <p className="text-[var(--text-tertiary)] text-xs mt-0.5 tabular-nums">{sub}</p>}
    </div>
  );
}

export function BudgetSummaryCard({ budget }: { budget: BudgetOutput }) {
  const { totals, feasibilityAssessment, annualEntries } = budget;
  const f = FEASIBILITY[feasibilityAssessment] ?? FEASIBILITY.feasible;

  const peakEntry = annualEntries.find((e) => e.year === totals.peakYear);
  const peakPctGDP = peakEntry?.defenceAsPercentGDP;
  const capexPct = (totals.averageCapexShareOfOutlay * 100).toFixed(1);

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider">Budget 2026–2047</p>
        <Badge variant="outline" className={`text-xs ${f.badge}`}>
          {f.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
        <StatItem
          label="Total outlay"
          value={formatCrore(totals.totalOutlayCrore)}
          sub={`Avg ${totals.averageDefencePercentGDP.toFixed(2)}% of GDP`}
        />
        <StatItem
          label="Peak year spend"
          value={formatCrore(totals.peakYearOutlay)}
          sub={`${totals.peakYear} · ${peakPctGDP?.toFixed(2) ?? '—'}% GDP`}
        />
        <StatItem
          label="Procurement (capex)"
          value={formatCrore(totals.totalProcurementCrore)}
          sub={`${capexPct}% of total outlay`}
          accent="text-[var(--brand)]"
        />
        <StatItem
          label="Personnel (pay + pension)"
          value={formatCrore(totals.totalPersonnelCrore)}
          sub={`${(100 * totals.totalPersonnelCrore / totals.totalOutlayCrore).toFixed(1)}% of total outlay`}
          accent="text-[var(--accent-yellow)]"
        />
        <StatItem
          label="Maintenance / O&M"
          value={formatCrore(totals.totalMaintenanceCrore)}
          accent="text-[var(--accent-blue)]"
        />
        <StatItem label="Avg annual outlay" value={formatCrore(totals.averageAnnualOutlay)} />
        <StatItem label="Avg % GDP" value={`${totals.averageDefencePercentGDP.toFixed(2)}%`} />
        <StatItem label="Avg capex share" value={`${capexPct}%`} />
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
        <p className="text-[var(--text-tertiary)] text-xs leading-relaxed">
          <span className="text-[var(--text-secondary)]">The capex squeeze:</span> personnel pay and pensions
          account for an average <span className="text-[var(--text-primary)] font-medium">
          {(100 * totals.totalPersonnelCrore / totals.totalOutlayCrore).toFixed(0)}%</span> of every defence rupee
          across 2026–2047, before a single platform is bought. Modelled with 8th, 9th and 10th Pay Commission
          step-ups (2027, 2037, 2047).
        </p>
      </div>
    </div>
  );
}
