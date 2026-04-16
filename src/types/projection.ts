import type { MilitaryService } from './equipment';

export interface EquipmentTarget {
  equipmentId: string;
  targetQuantity2047: number;
  targetQuantityByYear?: Record<number, number>;
}

export interface ProcurementOrder {
  id: string;
  equipmentId: string;
  quantity: number;
  isReplacement: boolean;
  orderYear: number;
  deliveryStartYear: number;
  deliveryCompleteYear: number;
  totalProcurementCost: number;
  annualCostProfile: Record<number, number>;
  unitCostOverride?: number;
  notes?: string;
}

export interface ProjectionConfig {
  schemaVersion: 1;
  id: string;
  name: string;
  description?: string;
  authorLabel?: string;
  scenarioType: 'baseline' | 'takshashila' | 'custom';
  targets: EquipmentTarget[];
  orders: ProcurementOrder[];
  budgetConstraint?: {
    annualBudgetCapCrore?: number;
    gdpPercentageCap?: number;
  };
  assumptionOverrides?: {
    inflationRatePercent?: number;
    gdpGrowthRatePercent?: number;
    rupeeUSDRate?: number;
    maintenanceRatePercent?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectionSnapshot {
  year: number;
  inventoryByEquipment: Record<string, number>;
  retirementsByEquipment: Record<string, number>;
  deliveriesByEquipment: Record<string, number>;
}

export interface DeltaSummary {
  totalAdditionalPlatforms: number;
  totalAdditionalCostCrore: number;
  byService: Record<MilitaryService, { platforms: number; costCrore: number }>;
}

export interface ProjectionOutput {
  config: ProjectionConfig;
  snapshots: ProjectionSnapshot[];
  budgetOutput?: import('./budget').BudgetOutput;
  deltaFromBaseline?: DeltaSummary;
}
