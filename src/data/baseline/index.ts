import { AIR_FORCE_INVENTORY } from './air-force';
import { ARMY_INVENTORY } from './army';
import { NAVY_INVENTORY } from './navy';
import type { Equipment } from '@/types/equipment';

export { AIR_FORCE_INVENTORY, ARMY_INVENTORY, NAVY_INVENTORY };

export const FULL_INVENTORY: Equipment[] = [
  ...AIR_FORCE_INVENTORY,
  ...ARMY_INVENTORY,
  ...NAVY_INVENTORY,
];

export const INVENTORY_METADATA = {
  primarySource: 'IISS Military Balance 2024/25',
  dataAsOf: '2024-01-01',
  disclaimer:
    'All quantities are open-source estimates from IISS Military Balance 2024/25 and publicly available sources. Actual classified inventory may differ. Unit costs are order-of-magnitude estimates (±20–30%) based on reported contract values converted at ₹84/USD (constant 2024 prices).',
  costAssumptions: {
    exchangeRateINRperUSD: 84,
    maintenanceRateDefault: 0.065,
    priceBaseYear: 2024,
  },
  lastUpdated: '2026-04-16',
};

export const EQUIPMENT_BY_ID: Record<string, Equipment> = Object.fromEntries(
  FULL_INVENTORY.map((e) => [e.id, e])
);
