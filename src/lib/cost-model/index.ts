import type { ProcurementOrder } from '@/types/projection';
import type { AnnualBudgetEntry, BudgetOutput } from '@/types/budget';
import type { ProjectionSnapshot } from '@/types/projection';
import { EQUIPMENT_BY_ID } from '@/data/baseline';
import { GDP_BY_YEAR } from '@/data/gdp-projections';
import { PERSONNEL_BY_YEAR } from '@/data/personnel-projection';
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

    // Personnel — pay + pension with CPC step-ups baked in
    const personnel = PERSONNEL_BY_YEAR[year];
    const payCrore = personnel?.payCrore ?? 0;
    const pensionCrore = personnel?.pensionCrore ?? 0;
    const personnelCrore = personnel?.totalCrore ?? 0;

    const totalDefenceOutlay = procurementSpend + maintenanceSpend + personnelCrore;
    const gdpEntry = GDP_BY_YEAR[year];
    const estimatedGDP = gdpEntry?.gdpCrore;
    const defenceAsPercentGDP = estimatedGDP
      ? (totalDefenceOutlay / estimatedGDP) * 100
      : undefined;
    const procurementAsPercentGDP = estimatedGDP
      ? (procurementSpend / estimatedGDP) * 100
      : undefined;
    const capexShareOfOutlay = totalDefenceOutlay > 0
      ? procurementSpend / totalDefenceOutlay
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
      payCrore,
      pensionCrore,
      personnelCrore,
      cpcEffectiveThisYear: personnel?.cpcEffectiveThisYear,
      totalDefenceOutlay,
      estimatedGDP,
      defenceAsPercentGDP,
      procurementAsPercentGDP,
      capexShareOfOutlay,
      exceedsCapConstraint,
      shortfallCrore,
    };
  });

  const totalProcurementCrore = annualEntries.reduce((s, e) => s + e.procurementSpend, 0);
  const totalMaintenanceCrore = annualEntries.reduce((s, e) => s + e.maintenanceSpend, 0);
  const totalPersonnelCrore = annualEntries.reduce((s, e) => s + e.personnelCrore, 0);
  const totalOutlayCrore = totalProcurementCrore + totalMaintenanceCrore + totalPersonnelCrore;
  const peakEntry = annualEntries.reduce((a, b) =>
    a.totalDefenceOutlay > b.totalDefenceOutlay ? a : b
  );

  const yearsWithGDP = annualEntries.filter((e) => e.defenceAsPercentGDP !== undefined);
  const averageDefencePercentGDP = yearsWithGDP.length
    ? yearsWithGDP.reduce((s, e) => s + (e.defenceAsPercentGDP ?? 0), 0) / yearsWithGDP.length
    : 0;
  const averageCapexShareOfOutlay = annualEntries.length
    ? annualEntries.reduce((s, e) => s + (e.capexShareOfOutlay ?? 0), 0) / annualEntries.length
    : 0;

  const stressedYears = annualEntries.filter((e) => e.exceedsCapConstraint).length;
  const feasibilityAssessment =
    stressedYears === 0 ? 'feasible' : stressedYears <= 5 ? 'stressed' : 'infeasible';

  return {
    annualEntries,
    totals: {
      totalProcurementCrore,
      totalMaintenanceCrore,
      totalPersonnelCrore,
      totalOutlayCrore,
      peakYearOutlay: peakEntry.totalDefenceOutlay,
      peakYear: peakEntry.year,
      averageAnnualOutlay: totalOutlayCrore / PROJECTION_YEARS.length,
      averageDefencePercentGDP,
      averageCapexShareOfOutlay,
    },
    feasibilityAssessment,
  };
}
