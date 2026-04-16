'use client';
import { Slider } from '@/components/ui/slider';
import { formatCrore } from '@/lib/utils';
import type { Equipment } from '@/types/equipment';
import { useProjectionStore } from '@/store/projection-store';

interface ProcurementRowProps {
  equipment: Equipment;
  baselineQty: number;
}

export function ProcurementRow({ equipment, baselineQty }: ProcurementRowProps) {
  const { active, setEquipmentTarget } = useProjectionStore();
  const target = active?.config.targets.find((t) => t.equipmentId === equipment.id);
  const currentTarget = target?.targetQuantity2047 ?? baselineQty;
  const delta = currentTarget - baselineQty;
  const maxSlider = Math.max(baselineQty * 3, 10);

  return (
    <div className="py-3.5 border-b border-[var(--border-subtle)] last:border-0">
      <div className="flex items-center justify-between mb-2.5 gap-3">
        <div className="min-w-0 flex-1">
          <span className="text-[var(--text-primary)] text-sm font-medium truncate block">
            {equipment.designation}
          </span>
          <span className="text-[var(--text-tertiary)] text-xs">
            {equipment.unitProcurementCost > 0 ? formatCrore(equipment.unitProcurementCost) + '/unit' : 'cost TBD'}
          </span>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {delta !== 0 && (
            <span className={`text-xs font-medium tabular-nums px-1.5 py-0.5 rounded ${
              delta > 0
                ? 'text-[var(--brand)] bg-[var(--brand-muted)]'
                : 'text-[var(--accent-blue)] bg-[var(--accent-blue-muted)]'
            }`}>
              {delta > 0 ? '+' : ''}{delta}
            </span>
          )}
          <span className="text-[var(--text-primary)] font-bold text-sm w-10 text-right tabular-nums">
            {currentTarget}
          </span>
        </div>
      </div>

      <Slider
        min={0}
        max={maxSlider}
        step={1}
        value={[currentTarget]}
        onValueChange={(vals) => setEquipmentTarget(equipment.id, Array.isArray(vals) ? vals[0] : vals)}
        className="w-full"
      />

      <div className="flex justify-between text-[var(--text-tertiary)] text-xs mt-1.5">
        <span>0</span>
        <span className="text-[var(--text-tertiary)]">baseline: {baselineQty}</span>
        <span>{maxSlider}</span>
      </div>
    </div>
  );
}
