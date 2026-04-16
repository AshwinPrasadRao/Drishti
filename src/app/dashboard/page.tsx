'use client';
import { useMemo } from 'react';
import { FULL_INVENTORY, INVENTORY_METADATA } from '@/data/baseline';
import { ServiceTab } from '@/components/inventory/ServiceTab';
import { EquipmentCard } from '@/components/inventory/EquipmentCard';
import { useUIStore } from '@/store/ui-store';
import { formatCrore } from '@/lib/utils';

const STATS = (platforms: number, onOrder: number, fleetCost: number, annualMaint: number) => [
  { label: 'Platforms in service', value: platforms.toLocaleString() },
  { label: 'On order', value: `+${onOrder.toLocaleString()}` },
  { label: 'Fleet replacement cost', value: formatCrore(fleetCost) },
  { label: 'Annual maintenance', value: formatCrore(annualMaint) },
];

export default function DashboardPage() {
  const { selectedService } = useUIStore();

  const filtered = useMemo(() => {
    if (selectedService === 'all') return FULL_INVENTORY;
    return FULL_INVENTORY.filter((e) => e.service === selectedService);
  }, [selectedService]);

  const totalPlatforms = filtered.reduce((s, e) => s + e.currentQuantity, 0);
  const totalOnOrder = filtered.reduce((s, e) => s + (e.quantityOnOrder ?? 0), 0);
  const totalFleetCost = filtered.reduce((s, e) => s + e.currentQuantity * e.unitProcurementCost, 0);
  const totalAnnualMaint = filtered.reduce((s, e) => s + e.currentQuantity * e.unitAnnualMaintenanceCost, 0);

  const stats = STATS(totalPlatforms, totalOnOrder, totalFleetCost, totalAnnualMaint);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="page-title">India's Current Military Inventory</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {INVENTORY_METADATA.primarySource} · Data as of {INVENTORY_METADATA.dataAsOf}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <ServiceTab />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((eq) => (
          <EquipmentCard key={eq.id} equipment={eq} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
        <p className="text-[var(--text-tertiary)] text-xs leading-relaxed">{INVENTORY_METADATA.disclaimer}</p>
      </div>
    </div>
  );
}
