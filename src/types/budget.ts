export interface AnnualBudgetEntry {
  year: number;
  procurementSpend: number;
  procurementByService: Record<string, number>;
  maintenanceSpend: number;
  maintenanceByService: Record<string, number>;
  totalDefenceOutlay: number;
  estimatedGDP?: number;
  defenceAsPercentGDP?: number;
  exceedsCapConstraint: boolean;
  shortfallCrore: number;
}

export interface BudgetTotals {
  totalProcurementCrore: number;
  totalMaintenanceCrore: number;
  totalOutlayCrore: number;
  peakYearOutlay: number;
  peakYear: number;
  averageAnnualOutlay: number;
}

export type FeasibilityAssessment = 'feasible' | 'stressed' | 'infeasible';

export interface BudgetOutput {
  annualEntries: AnnualBudgetEntry[];
  totals: BudgetTotals;
  feasibilityAssessment: FeasibilityAssessment;
}
