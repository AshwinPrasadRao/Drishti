import { v4 as uuidv4 } from 'uuid';
import type { ProjectionConfig, ProjectionSnapshot, ProcurementOrder, ProjectionOutput } from '@/types/projection';
import { EQUIPMENT_BY_ID, FULL_INVENTORY } from '@/data/baseline';
import { createOrder } from '@/lib/cost-model/procurement-schedule';
import { computeBudget } from '@/lib/cost-model';
import { PROJECTION_YEARS, START_YEAR, END_YEAR } from '@/lib/utils';

/**
 * Estimate how many units of a given equipment will retire between two years.
 * Retirements are spread linearly between expectedRetirementStart and expectedRetirementComplete.
 */
function estimateRetirements(equipmentId: string, fromYear: number, toYear: number): number {
  const eq = EQUIPMENT_BY_ID[equipmentId];
  if (!eq) return 0;
  if (!eq.expectedRetirementStart || !eq.expectedRetirementComplete) return 0;

  const retStart = eq.expectedRetirementStart;
  const retEnd = eq.expectedRetirementComplete;
  if (toYear <= retStart || fromYear >= retEnd) return 0;

  const totalToRetire = eq.currentQuantity + (eq.quantityOnOrder ?? 0);
  const totalRetirementSpan = retEnd - retStart;
  const overlapStart = Math.max(fromYear, retStart);
  const overlapEnd = Math.min(toYear, retEnd);
  const overlap = Math.max(0, overlapEnd - overlapStart);

  return Math.round((totalToRetire * overlap) / totalRetirementSpan);
}

/**
 * Build year-by-year inventory snapshots from a list of procurement orders.
 */
function buildSnapshots(
  orders: ProcurementOrder[],
  targets: ProjectionConfig['targets']
): ProjectionSnapshot[] {
  // Starting inventory: current quantity (in service)
  const inventory: Record<string, number> = {};
  for (const eq of FULL_INVENTORY) {
    inventory[eq.id] = eq.currentQuantity;
  }

  const snapshots: ProjectionSnapshot[] = [];

  for (const year of PROJECTION_YEARS) {
    const deliveries: Record<string, number> = {};
    const retirements: Record<string, number> = {};

    // Apply deliveries from orders completing this year
    for (const order of orders) {
      if (year >= order.deliveryStartYear && year <= order.deliveryCompleteYear) {
        const span = order.deliveryCompleteYear - order.deliveryStartYear + 1;
        const perYear = Math.ceil(order.quantity / span);
        const delivered = Math.min(perYear, order.quantity);
        deliveries[order.equipmentId] = (deliveries[order.equipmentId] ?? 0) + delivered;
      }
    }

    // Apply retirements for this year
    for (const eq of FULL_INVENTORY) {
      const retiring = estimateRetirements(eq.id, year, year + 1);
      if (retiring > 0) {
        retirements[eq.id] = retiring;
      }
    }

    // Update inventory
    for (const [id, qty] of Object.entries(deliveries)) {
      inventory[id] = (inventory[id] ?? 0) + qty;
    }
    for (const [id, qty] of Object.entries(retirements)) {
      inventory[id] = Math.max(0, (inventory[id] ?? 0) - qty);
    }

    snapshots.push({
      year,
      inventoryByEquipment: { ...inventory },
      deliveriesByEquipment: deliveries,
      retirementsByEquipment: retirements,
    });
  }

  return snapshots;
}

/**
 * Generate procurement orders needed to hit the target quantities by 2047,
 * accounting for retirements.
 */
function generateOrders(config: ProjectionConfig): ProcurementOrder[] {
  const orders: ProcurementOrder[] = [];

  for (const target of config.targets) {
    const eq = EQUIPMENT_BY_ID[target.equipmentId];
    if (!eq) continue;
    if (target.targetQuantity2047 === 0) continue;

    const currentAndOnOrder = eq.currentQuantity + (eq.quantityOnOrder ?? 0);
    const projectedRetirements = estimateRetirements(eq.id, START_YEAR, END_YEAR);
    const requiredNew = target.targetQuantity2047 + projectedRetirements - currentAndOnOrder;

    if (requiredNew <= 0) continue;

    // Latest year to place order so delivery completes by 2047
    const latestOrderYear = END_YEAR - eq.leadTimeYears;
    const deliveryCompleteYear = Math.min(END_YEAR, latestOrderYear + eq.leadTimeYears);

    // Split large batches (>50 units) into two orders to smooth budget
    if (requiredNew > 50) {
      const batch1 = Math.floor(requiredNew / 2);
      const batch2 = requiredNew - batch1;
      const midDelivery = Math.round((START_YEAR + deliveryCompleteYear) / 2);

      const order1 = createOrder(eq, batch1, midDelivery, projectedRetirements > 0);
      const order2 = createOrder(eq, batch2, deliveryCompleteYear, projectedRetirements > 0);
      orders.push({ ...order1, id: uuidv4() }, { ...order2, id: uuidv4() });
    } else {
      const order = createOrder(eq, requiredNew, deliveryCompleteYear, projectedRetirements > 0);
      orders.push({ ...order, id: uuidv4() });
    }
  }

  return orders;
}

/**
 * Run the full projection engine: generate orders, build snapshots, compute budget.
 */
export function runProjection(config: ProjectionConfig): ProjectionOutput {
  const orders = config.orders.length > 0 ? config.orders : generateOrders(config);
  const snapshots = buildSnapshots(orders, config.targets);
  const budgetOutput = computeBudget(
    orders,
    snapshots,
    config.budgetConstraint?.gdpPercentageCap
  );

  return {
    config: { ...config, orders },
    snapshots,
    budgetOutput,
  } as ProjectionOutput & { budgetOutput: typeof budgetOutput };
}

export { generateOrders, buildSnapshots, estimateRetirements };
