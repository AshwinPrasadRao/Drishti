'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCrore } from '@/lib/utils';
import type { Equipment } from '@/types/equipment';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2.5">
      <span className="text-[var(--text-tertiary)] text-sm">{label}</span>
      <span className="text-[var(--text-primary)] text-sm text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0">
      <p className="text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-widest mb-1">{title}</p>
      {children}
    </div>
  );
}

const SERVICE_NAMES: Record<string, string> = {
  air_force: 'Indian Air Force',
  army: 'Indian Army',
  navy: 'Indian Navy',
};

export function EquipmentDetailDrawer({
  equipment,
  open,
  onClose,
}: {
  equipment: Equipment;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-[var(--text-primary)] text-xl font-bold">
            {equipment.designation}
          </SheetTitle>
          <p className="text-[var(--text-secondary)] text-sm">{equipment.name}</p>
        </SheetHeader>

        <div className="flex flex-wrap gap-2 mb-5">
          <Badge variant="outline" className="border-[var(--border-default)] text-[var(--text-secondary)] text-xs">
            {SERVICE_NAMES[equipment.service] ?? equipment.service}
          </Badge>
          <Badge variant="outline" className="border-[var(--border-subtle)] text-[var(--text-tertiary)] capitalize text-xs">
            {equipment.origin}
          </Badge>
          {!equipment.inService && (
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">Proposed</Badge>
          )}
        </div>

        <Separator className="bg-[var(--border-subtle)] mb-5" />

        <div className="space-y-5">
          <Section title="Inventory">
            <Row label="In service" value={<strong className="text-[var(--text-primary)] tabular-nums">{equipment.currentQuantity.toLocaleString()}</strong>} />
            {(equipment.quantityOnOrder ?? 0) > 0 && (
              <Row label="On order" value={<span className="text-[var(--brand)] tabular-nums">+{equipment.quantityOnOrder}</span>} />
            )}
            {equipment.firstIntroduced && (
              <Row label="First introduced" value={equipment.firstIntroduced} />
            )}
          </Section>

          <Separator className="bg-[var(--border-subtle)]" />

          <Section title="Economics">
            <Row label="Unit procurement cost" value={<span className="tabular-nums">{formatCrore(equipment.unitProcurementCost)}</span>} />
            <Row label="Annual maintenance / unit" value={<span className="tabular-nums">{formatCrore(equipment.unitAnnualMaintenanceCost)}</span>} />
            <Row label="Fleet maintenance / yr" value={<span className="tabular-nums">{formatCrore(equipment.currentQuantity * equipment.unitAnnualMaintenanceCost)}</span>} />
          </Section>

          <Separator className="bg-[var(--border-subtle)]" />

          <Section title="Procurement & Lifecycle">
            <Row label="Lead time" value={`${equipment.leadTimeYears} years`} />
            <Row label="Operational life" value={`${equipment.lifeExpectancyYears} years`} />
            {equipment.expectedRetirementStart && (
              <Row label="Retirement begins" value={equipment.expectedRetirementStart} />
            )}
            {equipment.expectedRetirementComplete && (
              <Row label="Retirement complete" value={equipment.expectedRetirementComplete} />
            )}
          </Section>

          {equipment.notes && (
            <>
              <Separator className="bg-[var(--border-subtle)]" />
              <Section title="Notes">
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed pt-1">{equipment.notes}</p>
              </Section>
            </>
          )}

          <Separator className="bg-[var(--border-subtle)]" />

          <Section title="Sources">
            <ul className="space-y-1.5 pt-1">
              {equipment.sources.map((s, i) => (
                <li key={i} className="text-[var(--text-tertiary)] text-xs leading-relaxed">
                  {s.title} — <span className="text-[var(--text-secondary)]">{s.publisher}</span>, {s.year}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="mt-6 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
          <p className="text-[var(--text-tertiary)] text-xs leading-relaxed">
            All figures are open-source estimates. Classified actuals may differ. Costs in ₹ Crore at constant 2024 prices (₹84/USD).
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
