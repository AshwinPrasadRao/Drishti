'use client';
import { useState } from 'react';
import { useProjectionStore } from '@/store/projection-store';
import { BASELINE_PROJECTION } from '@/data/projections/baseline-projection';
import { FULL_INVENTORY } from '@/data/baseline';
import { ProcurementRow } from '@/components/builder/ProcurementRow';
import { BudgetAreaChart } from '@/components/budget/BudgetAreaChart';
import { BudgetSummaryCard } from '@/components/budget/BudgetSummaryCard';
import { ServiceTab } from '@/components/inventory/ServiceTab';
import { ShareModal } from '@/components/sharing/ShareModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, RotateCcw, Save } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';

export default function BuilderPage() {
  const { active, loadBaseline, loadTakshashila, newCustomProjection, resetToBaseline, saveToLocalStorage, isDirty } = useProjectionStore();
  const { selectedService } = useUIStore();
  const [shareOpen, setShareOpen] = useState(false);

  if (!active) return null;

  const { config, budgetOutput } = active;

  const baselineTargetMap = Object.fromEntries(
    BASELINE_PROJECTION.targets.map((t) => [t.equipmentId, t.targetQuantity2047])
  );

  const filtered = FULL_INVENTORY.filter(
    (e) => selectedService === 'all' || e.service === selectedService
  );

  return (
    <div className="space-y-6">
      {/* Scenario selector */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={config.scenarioType}
          onValueChange={(v) => {
            if (v === 'baseline') loadBaseline();
            else if (v === 'takshashila') loadTakshashila();
            else newCustomProjection();
          }}
        >
          <TabsList className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] h-9 p-1">
            <TabsTrigger
              value="baseline"
              className="text-xs data-[state=active]:bg-[var(--bg-highlight)] data-[state=active]:text-[var(--text-primary)] text-[var(--text-secondary)] rounded-md px-3"
            >
              Baseline
            </TabsTrigger>
            <TabsTrigger
              value="takshashila"
              className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white text-[var(--text-secondary)] rounded-md px-3"
            >
              Takshashila
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="text-xs data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white text-[var(--text-secondary)] rounded-md px-3"
            >
              Custom
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 ml-auto">
          {isDirty && (
            <Button
              size="sm"
              variant="outline"
              onClick={resetToBaseline}
              className="border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] gap-1.5 h-8 text-xs"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={saveToLocalStorage}
            className="border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] gap-1.5 h-8 text-xs"
          >
            <Save className="w-3 h-3" /> Save
          </Button>
          <Button
            size="sm"
            onClick={() => setShareOpen(true)}
            className="bg-[var(--brand)] hover:bg-orange-600 text-white gap-1.5 h-8 text-xs"
          >
            <Share2 className="w-3 h-3" /> Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: sliders */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="section-title">Target quantities by 2047</h3>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              Drag sliders to set your desired fleet size for each platform.
            </p>
          </div>
          <ServiceTab />
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2">
            {filtered.map((eq) => (
              <ProcurementRow
                key={eq.id}
                equipment={eq}
                baselineQty={baselineTargetMap[eq.id] ?? eq.currentQuantity}
              />
            ))}
          </div>
        </div>

        {/* Right: budget preview */}
        <div className="space-y-4">
          <div>
            <h3 className="section-title">Budget Impact</h3>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">Updates live as you adjust sliders.</p>
          </div>

          <BudgetSummaryCard budget={budgetOutput} />

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <p className="text-[var(--text-tertiary)] text-xs mb-3">Annual defence outlay (₹ Crore)</p>
            <BudgetAreaChart budget={budgetOutput} />
          </div>

          {config.budgetConstraint?.gdpPercentageCap && (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
              <p className="text-[var(--text-tertiary)] text-xs">Budget cap</p>
              <p className="text-[var(--text-primary)] font-semibold">{config.budgetConstraint.gdpPercentageCap}% of GDP</p>
            </div>
          )}

          <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
            <p className="text-[var(--text-tertiary)] text-xs leading-relaxed">
              Procurement costs use S-curve payment schedule across lead times. Maintenance at 6.5% of unit cost/year.
              All figures constant 2024 ₹.
            </p>
          </div>
        </div>
      </div>

      <ShareModal config={config} open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
