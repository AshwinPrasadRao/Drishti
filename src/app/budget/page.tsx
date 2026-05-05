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
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="section-title">Annual Defence Outlay 2026–2047</h3>
          <p className="text-[var(--text-tertiary)] text-[11px]">
            Stacked bars · ₹ Cr · dashed line tracks % of GDP (right axis)
          </p>
        </div>
        <BudgetAreaChart budget={budgetOutput} />
      </div>

      {/* Year-by-year table */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              <th className="text-left text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-3">Year</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-3">Procurement</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-3">Maintenance</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-3">Pay + Pension</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-3">Total</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-3">% GDP</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-3">Capex %</th>
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
                <td className="p-3 text-[var(--text-secondary)] font-medium tabular-nums">
                  {e.year}
                  {e.cpcEffectiveThisYear && (
                    <span className="ml-2 text-[10px] text-[var(--accent-yellow)] font-semibold tracking-wider">
                      {e.cpcEffectiveThisYear}TH CPC
                    </span>
                  )}
                </td>
                <td className="p-3 text-right text-[var(--brand)] tabular-nums">{formatCrore(e.procurementSpend)}</td>
                <td className="p-3 text-right text-[var(--accent-blue)] tabular-nums">{formatCrore(e.maintenanceSpend)}</td>
                <td className="p-3 text-right text-[var(--accent-yellow)] tabular-nums">{formatCrore(e.personnelCrore)}</td>
                <td className="p-3 text-right text-[var(--text-primary)] font-semibold tabular-nums">{formatCrore(e.totalDefenceOutlay)}</td>
                <td className="p-3 text-right text-[var(--text-secondary)] tabular-nums">
                  {e.defenceAsPercentGDP?.toFixed(2) ?? '—'}%
                  {e.exceedsCapConstraint && <span className="text-[var(--accent-red)] ml-1.5">⚠</span>}
                </td>
                <td className="p-3 text-right text-[var(--text-tertiary)] tabular-nums">
                  {e.capexShareOfOutlay !== undefined ? `${(e.capexShareOfOutlay * 100).toFixed(0)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-2">
        <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider">Modelling notes</p>
        <ul className="text-[var(--text-tertiary)] text-xs leading-relaxed space-y-1 list-disc pl-4">
          <li>
            Procurement uses an S-curve payment profile across each platform's lead time
            (15% on order, 70% during construction, 15% on delivery).
          </li>
          <li>O&amp;M cost: 6.5% of unit procurement cost per year, applied to year-end inventory.</li>
          <li>
            <span className="text-[var(--text-secondary)]">Personnel</span> = service pay + defence pension.
            Base FY2025-26 ≈ ₹4.85 lakh Cr. Real growth 1.0%/yr (pay) and 3.0%/yr (pension), with one-off uplifts
            of 12% / 11% / 10% in FY2027-28, FY2037-38 and FY2047-48 representing 8th, 9th and 10th Pay Commissions.
          </li>
          <li>GDP path: 11.5% nominal growth (≈6.5% real + 5% inflation). All currency values are constant 2024 ₹ Crore.</li>
        </ul>
      </div>
    </div>
  );
}
