'use client';
import { runProjection } from '@/lib/projection-engine';
import { BASELINE_PROJECTION } from '@/data/projections/baseline-projection';
import { TAKSHASHILA_PROJECTION } from '@/data/projections/takshashila-projection';
import { BudgetAreaChart } from '@/components/budget/BudgetAreaChart';
import { BudgetSummaryCard } from '@/components/budget/BudgetSummaryCard';
import { Badge } from '@/components/ui/badge';
import { formatCrore } from '@/lib/utils';
import type { BudgetOutput } from '@/types/budget';

const PRESETS = [BASELINE_PROJECTION, TAKSHASHILA_PROJECTION];

const SCENARIO_BADGE: Record<string, string> = {
  baseline:    'border-[var(--border-strong)] text-[var(--text-secondary)]',
  takshashila: 'border-blue-500/50 text-blue-400',
};

export default function ComparePage() {
  const results = PRESETS.map((p) => {
    const out = runProjection(p) as { config: typeof p; budgetOutput: BudgetOutput };
    return out;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Compare Projections</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Side-by-side: Baseline vs Takshashila-informed projection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((r) => (
          <div key={r.config.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[var(--text-primary)] font-semibold text-sm">{r.config.name}</h3>
              <Badge
                variant="outline"
                className={`text-xs ${SCENARIO_BADGE[r.config.scenarioType] ?? ''}`}
              >
                {r.config.scenarioType}
              </Badge>
            </div>
            <BudgetSummaryCard budget={r.budgetOutput} />
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <BudgetAreaChart budget={r.budgetOutput} />
            </div>
          </div>
        ))}
      </div>

      {/* Delta table */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-subtle)]">
          <h3 className="section-title">Year-by-Year Comparison</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              <th className="text-left text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-4">Year</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-4">Baseline</th>
              <th className="text-right text-blue-400 text-xs font-semibold uppercase tracking-wider p-4">Takshashila</th>
              <th className="text-right text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider p-4">Delta</th>
            </tr>
          </thead>
          <tbody>
            {results[0].budgetOutput.annualEntries.map((baseEntry, i) => {
              const takEntry = results[1].budgetOutput.annualEntries[i];
              const delta = takEntry.totalDefenceOutlay - baseEntry.totalDefenceOutlay;
              return (
                <tr
                  key={baseEntry.year}
                  className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <td className="p-4 text-[var(--text-secondary)] tabular-nums">{baseEntry.year}</td>
                  <td className="p-4 text-right text-[var(--text-secondary)] tabular-nums">{formatCrore(baseEntry.totalDefenceOutlay)}</td>
                  <td className="p-4 text-right text-blue-400 tabular-nums">{formatCrore(takEntry.totalDefenceOutlay)}</td>
                  <td className={`p-4 text-right font-semibold tabular-nums ${delta >= 0 ? 'text-[var(--brand)]' : 'text-[var(--accent-green)]'}`}>
                    {delta >= 0 ? '+' : ''}{formatCrore(delta)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
