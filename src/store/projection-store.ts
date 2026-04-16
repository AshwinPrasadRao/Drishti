'use client';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { ProjectionConfig } from '@/types/projection';
import type { BudgetOutput } from '@/types/budget';
import type { ProjectionSnapshot } from '@/types/projection';
import { BASELINE_PROJECTION } from '@/data/projections/baseline-projection';
import { TAKSHASHILA_PROJECTION } from '@/data/projections/takshashila-projection';
import { runProjection } from '@/lib/projection-engine';

export interface ActiveProjection {
  config: ProjectionConfig;
  snapshots: ProjectionSnapshot[];
  budgetOutput: BudgetOutput;
}

interface ProjectionStore {
  active: ActiveProjection | null;
  isDirty: boolean;

  loadBaseline: () => void;
  loadTakshashila: () => void;
  loadConfig: (config: ProjectionConfig) => void;
  newCustomProjection: () => void;

  setEquipmentTarget: (equipmentId: string, quantity: number) => void;
  setMeta: (name: string, description: string, authorLabel: string) => void;
  setBudgetCap: (gdpPercent: number | undefined) => void;
  resetToBaseline: () => void;

  saveToLocalStorage: () => void;
}

function compute(config: ProjectionConfig): ActiveProjection {
  const result = runProjection(config);
  return {
    config: result.config,
    snapshots: result.snapshots,
    budgetOutput: result.budgetOutput as BudgetOutput,
  };
}

export const useProjectionStore = create<ProjectionStore>((set, get) => ({
  active: compute(BASELINE_PROJECTION),
  isDirty: false,

  loadBaseline: () => set({ active: compute(BASELINE_PROJECTION), isDirty: false }),
  loadTakshashila: () => set({ active: compute(TAKSHASHILA_PROJECTION), isDirty: false }),

  loadConfig: (config) => set({ active: compute(config), isDirty: false }),

  newCustomProjection: () => {
    const custom: ProjectionConfig = {
      ...BASELINE_PROJECTION,
      id: uuidv4(),
      name: 'My Projection',
      description: '',
      authorLabel: '',
      scenarioType: 'custom',
      orders: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ active: compute(custom), isDirty: true });
  },

  setEquipmentTarget: (equipmentId, quantity) => {
    const { active } = get();
    if (!active) return;
    const targets = active.config.targets.map((t) =>
      t.equipmentId === equipmentId ? { ...t, targetQuantity2047: quantity } : t
    );
    const exists = targets.some((t) => t.equipmentId === equipmentId);
    const newTargets = exists
      ? targets
      : [...targets, { equipmentId, targetQuantity2047: quantity }];
    const newConfig: ProjectionConfig = {
      ...active.config,
      targets: newTargets,
      orders: [],
      scenarioType: 'custom',
      updatedAt: new Date().toISOString(),
    };
    set({ active: compute(newConfig), isDirty: true });
  },

  setMeta: (name, description, authorLabel) => {
    const { active } = get();
    if (!active) return;
    const newConfig: ProjectionConfig = {
      ...active.config,
      name,
      description,
      authorLabel,
      updatedAt: new Date().toISOString(),
    };
    set({ active: { ...active, config: newConfig }, isDirty: true });
  },

  setBudgetCap: (gdpPercent) => {
    const { active } = get();
    if (!active) return;
    const newConfig: ProjectionConfig = {
      ...active.config,
      budgetConstraint: gdpPercent !== undefined ? { gdpPercentageCap: gdpPercent } : undefined,
      orders: [],
      updatedAt: new Date().toISOString(),
    };
    set({ active: compute(newConfig), isDirty: true });
  },

  resetToBaseline: () => {
    const { active } = get();
    if (!active) return;
    const reset: ProjectionConfig = {
      ...BASELINE_PROJECTION,
      id: active.config.id,
      name: active.config.name,
      authorLabel: active.config.authorLabel,
      scenarioType: 'custom',
      orders: [],
      updatedAt: new Date().toISOString(),
    };
    set({ active: compute(reset), isDirty: true });
  },

  saveToLocalStorage: () => {
    const { active } = get();
    if (!active) return;
    try {
      const existing = JSON.parse(localStorage.getItem('drishti:projections:v1') ?? '[]');
      const idx = existing.findIndex((p: ProjectionConfig) => p.id === active.config.id);
      if (idx >= 0) existing[idx] = active.config;
      else existing.push(active.config);
      localStorage.setItem('drishti:projections:v1', JSON.stringify(existing));
    } catch { /* ignore storage errors */ }
    set({ isDirty: false });
  },
}));
