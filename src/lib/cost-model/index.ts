import type { ProcurementOrder } from '@/types/projection';
import type { AnnualBudgetEntry, BudgetOutput } from '@/types/budget';
import type { ProjectionSnapshot } from '@/types/projection';
import { EQUIPMENT_BY_ID } from '@/data/baseline';
import { GDP_BY_YEAR } from '@/data/gdp-projections';
import { PROJECTION_YEARS } from '@/lib/utils';

export function computeBudget(
  orders: ProcurementOrder[],
  snapshots: ProjectionSnapshot[],
  gdpCapPercent?: number
): BudgetOutput {
  const snapshotByYear: Record<number, ProjectionSnapshot> = Object.fromEntries(
    snapshots.map((s) => [s.year, s])
  );

  const annualEntries: AnnualBudgetEntry[] = PROJECTION_YEARS.map((year) => {
    // Procurement spend
    let procurementSpend = 0;
    const procurementByService: Record<string, number> = {};

    for (const order of orders) {
      const yearCost = order.annualCostProfile[year] ?? 0;
      if (yearCost > 0) {
        procurementSpend += yearCost;
        const eq = EQUIPMENT_BY_ID[order.equipmentId];
        if (eq) {
          procurementByService[eq.service] = (procurementByService[eq.service] ?? 0) + yearCost;
        }
      }
    }

    // Maintenance spend
    let maintenanceSpend = 0;
    const maintenanceByService: Record<string, number> = {};
    const snapshot = snapshotByYear[year];

    if (snapshot) {
      for (const [eqId, qty] of Object.entries(snapshot.inventoryByEquipment)) {
        const eq = EQUIPMENT_BY_ID[eqId];
        if (eq && qty > 0) {
          const maint = qty * eq.unitAnnualMaintenanceCost;
          maintenanceSpend += maint;
          maintenanceByService[eq.service] = (maintenanceByService[eq.service] ?? 0) + maint;
        }
      }
    }

    const totalDefenceOutlay = procurementSpend + maintenanceSpend;
    const gdpEntry = GDP_BY_YEAR[year];
    const estimatedGDP = gdpEntry?.gdpCrore;
    const defenceAsPercentGDP = estimatedGDP
      ? (totalDefenceOutlay / estimatedGDP) * 100
      : undefined;

    const capCrore = gdpCapPercent && estimatedGDP
      ? (gdpCapPercent / 100) * estimatedGDP
      : undefined;

    const exceedsCapConstraint = capCrore !== undefined && totalDefenceOutlay > capCrore;
    const shortfallCrore = capCrore !== undefined ? Math.max(0, totalDefenceOutlay - capCrore) : 0;

    return {
      year,
      procurementSpend,
      procurementByService,
      maintenanceSpend,
      maintenanceByService,
      totalDefenceOutlay,
      estimatedGDP,
      defenceAsPercentGDP,
      exceedsCapConstraint,
      shortfallCrore,
    };
  });

  const totalProcurementCrore = annualEntries.reduce((s, e) => s + e.procurementSpend, 0);
  const totalMaintenanceCrore = annualEntries.reduce((s, e) => s + e.maintenanceSpend, 0);
  const totalOutlayCrore = totalProcurementCrore + totalMaintenanceCrore;
  const peakEntry = annualEntries.reduce((a, b) =>
    a.totalDefenceOutlay > b.totalDefenceOutlay ? a : b
  );

  const stressedYears = annualEntries.filter((e) => e.exceedsCapConstraint).length;
  const feasibilityAssessment =
    stressedYears === 0 ? 'feasible' : stressedYears <= 5 ? 'stressed' : 'infeasible';

  return {
    annualEntries,
    totals: {
      totalProcurementCrore,
      totalMaintenanceCrore,
      totalOutlayCrore,
      peakYearOutlay: peakEntry.totalDefenceOutlay,
      peakYear: peakEntry.year,
      averageAnnualOutlay: totalOutlayCrore / PROJECTION_YEARS.length,
    },
    feasibilityAssessment,
  };
}
