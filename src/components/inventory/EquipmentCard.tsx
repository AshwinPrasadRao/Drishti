'use client';
import { Badge } from '@/components/ui/badge';
import { formatCrore } from '@/lib/utils';
import type { Equipment } from '@/types/equipment';
import { useState } from 'react';
import { EquipmentDetailDrawer } from './EquipmentDetailDrawer';

const SERVICE_BADGE: Record<string, string> = {
  air_force: 'border-[var(--service-iaf)]/30 text-[var(--service-iaf)] bg-[var(--service-iaf)]/8',
  army:      'border-[var(--service-ia)]/30  text-[var(--service-ia)]  bg-[var(--service-ia)]/8',
  navy:      'border-[var(--service-in)]/30  text-[var(--service-in)]  bg-[var(--service-in)]/8',
};

const SERVICE_LABEL: Record<string, string> = {
  air_force: 'IAF',
  army: 'IA',
  navy: 'IN',
};

const CATEGORY_LABELS: Record<string, string> = {
  combat_aircraft: 'Combat Aircraft',
  transport_aircraft: 'Transport',
  trainer_aircraft: 'Trainer',
  attack_helicopter: 'Attack Helo',
  utility_helicopter: 'Utility Helo',
  uav: 'UAV',
  main_battle_tank: 'MBT',
  infantry_fighting_vehicle: 'IFV',
  armoured_personnel_carrier: 'APC',
  self_propelled_artillery: 'SP Artillery',
  towed_artillery: 'Towed Artillery',
  multiple_rocket_launcher: 'MLRS',
  air_defence_system: 'Air Defence',
  anti_tank_missile: 'ATGM',
  aircraft_carrier: 'Carrier',
  destroyer: 'Destroyer',
  frigate: 'Frigate',
  corvette: 'Corvette',
  submarine_conventional: 'Submarine',
  submarine_nuclear: 'SSBN',
  offshore_patrol_vessel: 'OPV',
  naval_helicopter: 'Naval Helo',
  maritime_patrol_aircraft: 'MPA',
  landing_ship: 'Landing Ship',
};

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group relative cursor-pointer rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3 transition-all duration-150 hover:border-[var(--border-default)] hover:bg-[var(--bg-elevated)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[var(--text-primary)] font-medium text-sm truncate group-hover:text-[var(--brand)] transition-colors">
              {equipment.designation}
            </p>
            <p className="text-[var(--text-tertiary)] text-xs truncate mt-0.5">{equipment.name}</p>
          </div>
          <Badge
            variant="outline"
            className={`text-xs flex-shrink-0 font-medium ${SERVICE_BADGE[equipment.service] ?? ''}`}
          >
            {SERVICE_LABEL[equipment.service] ?? equipment.service}
          </Badge>
        </div>

        {/* Qty */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[var(--text-primary)] font-bold text-2xl leading-none tabular-nums">
              {equipment.currentQuantity.toLocaleString()}
            </p>
            <p className="text-[var(--text-tertiary)] text-xs mt-1">in service</p>
          </div>
          {(equipment.quantityOnOrder ?? 0) > 0 && (
            <div className="text-right">
              <p className="text-[var(--brand)] font-semibold text-sm">+{equipment.quantityOnOrder}</p>
              <p className="text-[var(--text-tertiary)] text-xs">on order</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <span className="text-[var(--text-tertiary)] text-xs">
            {CATEGORY_LABELS[equipment.category] ?? equipment.category}
          </span>
          <span className="text-[var(--text-secondary)] text-xs tabular-nums">
            {equipment.unitProcurementCost > 0 ? formatCrore(equipment.unitProcurementCost) + '/unit' : 'cost TBD'}
          </span>
        </div>
      </div>

      <EquipmentDetailDrawer equipment={equipment} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
