import type { ProjectionConfig } from '@/types/projection';

// Baseline projection: current trajectory
// Reflects existing orders + modest organic growth at ~1.9% of GDP
// No new major programmes beyond what is already contracted

export const BASELINE_PROJECTION: ProjectionConfig = {
  schemaVersion: 1,
  id: 'baseline',
  name: 'Baseline (Current Trajectory)',
  description:
    'Reflects India\'s current procurement trajectory. Existing contracted orders are fulfilled, ageing platforms retire on schedule, and defence spending stays near 1.9% of GDP. No major new programmes beyond what is already contracted.',
  authorLabel: 'Drishti Team',
  scenarioType: 'baseline',
  targets: [
    // Air Force — Tejas Mk1A deliveries complete by 2030, modest Rafale add-on
    { equipmentId: 'su30mki', targetQuantity2047: 260 },
    { equipmentId: 'rafale', targetQuantity2047: 62 }, // 36 + 26 on order
    { equipmentId: 'mirage2000', targetQuantity2047: 0 }, // fully retired by 2035
    { equipmentId: 'mig29', targetQuantity2047: 0 }, // retiring 2030–2040
    { equipmentId: 'tejas_mk1a', targetQuantity2047: 260 }, // 40 + 220 on order
    { equipmentId: 'jaguar', targetQuantity2047: 0 }, // retiring 2025–2030
    { equipmentId: 'apache', targetQuantity2047: 22 },
    { equipmentId: 'chinook', targetQuantity2047: 15 },
    { equipmentId: 'c17', targetQuantity2047: 11 },
    { equipmentId: 'c130j', targetQuantity2047: 12 },
    { equipmentId: 'heron_tp', targetQuantity2047: 30 },
    { equipmentId: 'amca_mk2_6gen', targetQuantity2047: 0 }, // not pursued under baseline
    { equipmentId: 'mq9b', targetQuantity2047: 31 }, // already FMS-contracted
    { equipmentId: 'tapas_hale', targetQuantity2047: 0 },
    // Army
    { equipmentId: 't90', targetQuantity2047: 2121 }, // 1657 + 464 on order
    { equipmentId: 't72', targetQuantity2047: 0 }, // retired by 2040
    { equipmentId: 'arjun_mk1a', targetQuantity2047: 242 }, // 124 + 118 on order
    { equipmentId: 'zorawar', targetQuantity2047: 354 }, // 59 on order + likely second batch
    { equipmentId: 'bmp2', targetQuantity2047: 0 }, // retiring
    { equipmentId: 'k9_vajra', targetQuantity2047: 200 },
    { equipmentId: 'bofors_fg', targetQuantity2047: 0 },
    { equipmentId: 'm777', targetQuantity2047: 145 },
    { equipmentId: 'pinaka', targetQuantity2047: 534 },
    { equipmentId: 's400', targetQuantity2047: 5 },
    { equipmentId: 'spike_atgm', targetQuantity2047: 8356 },
    // Navy
    { equipmentId: 'ins_vikrant', targetQuantity2047: 1 },
    { equipmentId: 'ins_vikramaditya', targetQuantity2047: 0 }, // retired ~2037
    { equipmentId: 'iac2', targetQuantity2047: 1 }, // replaces Vikramaditya ~2038
    { equipmentId: 'visakhapatnam_class', targetQuantity2047: 4 },
    { equipmentId: 'kolkata_class', targetQuantity2047: 3 },
    { equipmentId: 'delhi_class', targetQuantity2047: 0 },
    { equipmentId: 'shivalik_class', targetQuantity2047: 3 },
    { equipmentId: 'nilgiri_class', targetQuantity2047: 7 },
    { equipmentId: 'project_17b', targetQuantity2047: 0 }, // baseline: not initiated
    { equipmentId: 'project_75_alpha', targetQuantity2047: 2 }, // 2 SSNs already CCS-cleared
    { equipmentId: 'talwar_class', targetQuantity2047: 6 }, // Batch 3 + existing
    { equipmentId: 'kamorta_class', targetQuantity2047: 8 },
    { equipmentId: 'vela_class', targetQuantity2047: 6 },
    { equipmentId: 'sindhughosh_class', targetQuantity2047: 0 }, // retiring
    { equipmentId: 'project75i', targetQuantity2047: 6 },
    { equipmentId: 'arihant_class', targetQuantity2047: 4 },
    { equipmentId: 'p8i', targetQuantity2047: 21 },
    { equipmentId: 'mh60r', targetQuantity2047: 24 },
  ],
  orders: [], // computed by engine
  budgetConstraint: {
    gdpPercentageCap: 2.0,
  },
  createdAt: '2026-04-16T00:00:00Z',
  updatedAt: '2026-04-16T00:00:00Z',
};
