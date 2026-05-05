export interface AnnualBudgetEntry {
  year: number;
  procurementSpend: number;        // capex / modernisation
  procurementByService: Record<string, number>;
  maintenanceSpend: number;        // O&M of installed inventory
  maintenanceByService: Record<string, number>;
  payCrore: number;                // personnel pay (post-CPC effects)
  pensionCrore: number;            // defence pension
  personnelCrore: number;          // pay + pension
  cpcEffectiveThisYear?: number;   // CPC number if step-up landed this year
  totalDefenceOutlay: number;      // proc + maint + personnel
  estimatedGDP?: number;
  defenceAsPercentGDP?: number;
  procurementAsPercentGDP?: number;
  capexShareOfOutlay?: number;     // procurement / total — the squeeze
  exceedsCapConstraint: boolean;
  shortfallCrore: number;
}

export interface BudgetTotals {
  totalProcurementCrore: number;
  totalMaintenanceCrore: number;
  totalPersonnelCrore: number;
  totalOutlayCrore: number;
  peakYearOutlay: number;
  peakYear: number;
  averageAnnualOutlay: number;
  averageDefencePercentGDP: number;
  averageCapexShareOfOutlay: number;
}

export type FeasibilityAssessment = 'feasible' | 'stressed' | 'infeasible';

export interface BudgetOutput {
  annualEntries: AnnualBudgetEntry[];
  totals: BudgetTotals;
  feasibilityAssessment: FeasibilityAssessment;
}
