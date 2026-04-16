'use client';
import { useProjectionStore } from '@/store/projection-store';
import { BudgetAreaChart } from '@/components/budget/BudgetAreaChart';
import { BudgetSummaryCard } from '@/components/budget/BudgetSummaryCard';
import { formatCrore } from '@/lib/utils';

export default function BudgetPage() {
  const active = useProjectionStore((s) => s.active);

  if (!active) return (
    <p className="text-[var(--text-secondary)]">No projection loaded.</p>
  );

  const { config, budgetOutput } = active;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Budget Model</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Projection: <span className="text-[var(--text-primary)]">{config.name}</span>
          {config.authorLabel && (
            <span className="text-[var(--text-tertiary)]"> · {config.authorLabel}</span>
          )}
        </p>
      </div>

      <BudgetSummaryCard budget={budgetOutput} />

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <h3 className="section-title mb-4">Annual Defence Outlay 2026–2047</h3>
        <BudgetAreaChart budget={budgetOutput} />
      </div>

      {/* Year-by-year table */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              <th className="text-left text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-4">Year</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-4">Procurement</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-4">Maintenance</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-4">Total Outlay</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-4">% GDP</th>
            </tr>
          </thead>
          <tbody>
            {budgetOutput.annualEntries.map((e) => (
              <tr
                key={e.year}
                className={`border-b border-[var(--border-subtle)] last:border-0 transition-colors hover:bg-[var(--bg-elevated)] ${
                  e.exceedsCapConstraint ? 'bg-red-950/10' : ''
                }`}
              >
                <td className="p-4 text-[var(--text-secondary)] font-medium tabular-nums">{e.year}</td>
                <td className="p-4 text-right text-[var(--brand)] tabular-nums">{formatCrore(e.procurementSpend)}</td>
                <td className="p-4 text-right text-[var(--accent-blue)] tabular-nums">{formatCrore(e.maintenanceSpend)}</td>
                <td className="p-4 text-right text-[var(--text-primary)] font-semibold tabular-nums">{formatCrore(e.totalDefenceOutlay)}</td>
                <td className="p-4 text-right text-[var(--text-secondary)] tabular-nums">
                  {e.defenceAsPercentGDP?.toFixed(2) ?? '—'}%
                  {e.exceedsCapConstraint && <span className="text-[var(--accent-red)] ml-1.5">⚠</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
        <p className="text-[var(--text-tertiary)] text-xs leading-relaxed">
          Procurement costs use an S-curve payment schedule spread across lead times (15% at order, 70% during construction, 15% on delivery).
          Maintenance at 6.5% of unit cost per year. GDP projections at 11.5% nominal growth.
          All values in constant 2024 ₹ Crore.
        </p>
      </div>
    </div>
  );
}
