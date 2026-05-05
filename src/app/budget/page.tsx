'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useProjectionStore } from '@/store/projection-store';
import { BudgetAreaChart } from '@/components/budget/BudgetAreaChart';
import { BudgetSummaryCard } from '@/components/budget/BudgetSummaryCard';
import { formatCrore } from '@/lib/utils';

export default function BudgetPage() {
  const active = useProjectionStore((s) => s.active);
  const [tableOpen, setTableOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  if (!active) return (
    <p className="text-[var(--text-secondary)]">No projection loaded.</p>
  );

  const { config, budgetOutput } = active;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Budget Model</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {config.name}
          {config.authorLabel && (
            <span className="text-[var(--text-tertiary)]"> · {config.authorLabel}</span>
          )}
        </p>
      </div>

      <BudgetSummaryCard budget={budgetOutput} />

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <div className="flex items-baseline justify-between mb-4 gap-3">
          <h3 className="section-title">Annual outlay, 2026–2047</h3>
          <p className="text-[var(--text-tertiary)] text-xs">₹ Cr · dashed line: % GDP</p>
        </div>
        <BudgetAreaChart budget={budgetOutput} />
      </div>

      {/* Year-by-year table — collapsed by default to reduce noise */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        <button
          onClick={() => setTableOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[var(--bg-elevated)] transition-colors"
          aria-expanded={tableOpen}
        >
          <span className="section-title">Year-by-year breakdown</span>
          <span className="flex items-center gap-2 text-[var(--text-tertiary)] text-xs">
            22 rows
            {tableOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        </button>
        {tableOpen && (
          <table className="w-full text-sm border-t border-[var(--border-subtle)]">
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
                      <span className="ml-2 text-xs text-[var(--accent-yellow)] font-semibold tracking-wider">
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
        )}
      </div>

      {/* Modelling notes — collapsed; reference material, not primary content */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        <button
          onClick={() => setNotesOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[var(--bg-elevated)] transition-colors"
          aria-expanded={notesOpen}
        >
          <span className="section-title">Modelling notes</span>
          {notesOpen ? <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" /> : <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" />}
        </button>
        {notesOpen && (
          <ul className="text-[var(--text-tertiary)] text-sm leading-relaxed space-y-2 list-disc pl-9 pr-5 pb-5 pt-1 border-t border-[var(--border-subtle)]">
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
            <li>GDP path: 6.5% real growth (constant 2024 ₹). All currency values are constant 2024 ₹ Crore.</li>
          </ul>
        )}
      </div>
    </div>
  );
}
