import type { Equipment } from '@/types/equipment';
import type { ProcurementOrder } from '@/types/projection';
import { START_YEAR, END_YEAR } from '@/lib/utils';

const MOBILISATION_SHARE = 0.15;
const COMPLETION_SHARE = 0.15;
const CONSTRUCTION_SHARE = 0.70;

/**
 * Spread total procurement cost across years using an S-curve:
 *   - 15% at order signing (mobilisation)
 *   - 70% spread evenly across mid-years (construction)
 *   - 15% at delivery completion (acceptance)
 */
export function buildPaymentProfile(
  order: Pick<ProcurementOrder, 'orderYear' | 'deliveryCompleteYear' | 'totalProcurementCost'>
): Record<number, number> {
  const { orderYear, deliveryCompleteYear, totalProcurementCost } = order;
  const profile: Record<number, number> = {};

  if (totalProcurementCost <= 0) return profile;

  // Clamp to visible range for the chart (but still compute full profile)
  const clamp = (yr: number) => Math.max(START_YEAR, Math.min(END_YEAR, yr));

  // Mobilisation payment at order year
  const mobYear = clamp(orderYear);
  profile[mobYear] = (profile[mobYear] ?? 0) + totalProcurementCost * MOBILISATION_SHARE;

  // Completion payment at delivery
  const compYear = clamp(deliveryCompleteYear);
  profile[compYear] = (profile[compYear] ?? 0) + totalProcurementCost * COMPLETION_SHARE;

  // Construction payments across mid-years
  const midYears: number[] = [];
  for (let y = orderYear + 1; y < deliveryCompleteYear; y++) {
    midYears.push(y);
  }

  if (midYears.length > 0) {
    const perYear = (totalProcurementCost * CONSTRUCTION_SHARE) / midYears.length;
    for (const y of midYears) {
      const cy = clamp(y);
      profile[cy] = (profile[cy] ?? 0) + perYear;
    }
  } else {
    // Lead time of 0 or 1 year — split remaining between mob and completion
    profile[mobYear] = (profile[mobYear] ?? 0) + totalProcurementCost * CONSTRUCTION_SHARE * 0.5;
    profile[compYear] = (profile[compYear] ?? 0) + totalProcurementCost * CONSTRUCTION_SHARE * 0.5;
  }

  return profile;
}

/**
 * Generate a ProcurementOrder for a batch of platforms to be delivered by a target year.
 */
export function createOrder(
  equipment: Equipment,
  quantity: number,
  deliveryCompleteYear: number,
  isReplacement: boolean,
  unitCostOverride?: number
): Omit<ProcurementOrder, 'id'> {
  const unitCost = unitCostOverride ?? equipment.unitProcurementCost;
  const totalCost = quantity * unitCost;
  const orderYear = Math.max(START_YEAR, deliveryCompleteYear - equipment.leadTimeYears);
  const deliveryStartYear = orderYear + Math.floor(equipment.leadTimeYears * 0.6);

  const annualCostProfile = buildPaymentProfile({
    orderYear,
    deliveryCompleteYear,
    totalProcurementCost: totalCost,
  });

  return {
    equipmentId: equipment.id,
    quantity,
    isReplacement,
    orderYear,
    deliveryStartYear,
    deliveryCompleteYear,
    totalProcurementCost: totalCost,
    annualCostProfile,
    unitCostOverride,
  };
}
