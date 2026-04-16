import { create } from 'zustand';
import type { MilitaryService } from '@/types/equipment';

interface UIStore {
  selectedService: MilitaryService | 'all';
  selectedYear: number;
  costDisplayMode: 'real_2024' | 'nominal';
  budgetOverlayMode: 'absolute' | 'gdp_pct';
  sidebarOpen: boolean;

  setSelectedService: (s: MilitaryService | 'all') => void;
  setSelectedYear: (y: number) => void;
  setCostDisplayMode: (m: 'real_2024' | 'nominal') => void;
  setBudgetOverlayMode: (m: 'absolute' | 'gdp_pct') => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedService: 'all',
  selectedYear: 2035,
  costDisplayMode: 'real_2024',
  budgetOverlayMode: 'absolute',
  sidebarOpen: true,

  setSelectedService: (s) => set({ selectedService: s }),
  setSelectedYear: (y) => set({ selectedYear: y }),
  setCostDisplayMode: (m) => set({ costDisplayMode: m }),
  setBudgetOverlayMode: (m) => set({ budgetOverlayMode: m }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
