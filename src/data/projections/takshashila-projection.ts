import type { ProjectionConfig } from '@/types/projection';

// Takshashila-informed projection
//
// Sources:
// 1. Takshashila Institution — "Neither Guns nor Butter: The Inconvenient Truth of India's Defence Financing" (2022)
//    Recommends 2.5% GDP as achievable; argues meaningful modernisation requires 2.5%+ with high growth
// 2. Takshashila strategic doctrine: prioritise airpower, precision strike, special forces over large armoured formations
//    for anti-China deterrence; restructure Pakistan-oriented strike corps
// 3. Indian Navy Long Term Perspective Plan (publicly cited targets):
//    — 24 conventional submarines by mid-2030s (P75I follow-on)
//    — IAC-2 replacing Vikramaditya ~2035-2038; 2-carrier continuous ops
//    — Fleet of 200+ ships by 2035
//
// This projection applies Takshashila's 2.5% GDP target to the Navy's stated goals,
// with army rebalancing toward lighter/precision forces and air force prioritising indigenous jets.
// NOTE: Takshashila has not officially endorsed these specific platform numbers.
// They are constructed from their published principles + Navy's own stated goals.

export const TAKSHASHILA_PROJECTION: ProjectionConfig = {
  schemaVersion: 1,
  id: 'takshashila',
  name: 'Takshashila-Informed (2.5% GDP)',
  description:
    'Based on Takshashila Institution\'s published defence financing recommendations (2.5% of GDP) combined with Indian Navy\'s Long Term Perspective Plan targets. Prioritises indigenous production (Tejas Mk2, Arjun), submarine fleet expansion (P75I + follow-on), and army rebalancing toward precision strike over heavy armour.',
  authorLabel: 'Drishti Team (based on Takshashila published research)',
  scenarioType: 'takshashila',
  targets: [
    // Air Force — accelerated Tejas Mk2 + MRFA, reduce Russian dependence
    { equipmentId: 'su30mki', targetQuantity2047: 200 }, // gradual reduction as Tejas Mk2 enters service
    { equipmentId: 'rafale', targetQuantity2047: 62 },
    { equipmentId: 'mirage2000', targetQuantity2047: 0 },
    { equipmentId: 'mig29', targetQuantity2047: 0 },
    { equipmentId: 'tejas_mk1a', targetQuantity2047: 260 },
    { equipmentId: 'jaguar', targetQuantity2047: 0 },
    { equipmentId: 'apache', targetQuantity2047: 40 }, // additional squadron
    { equipmentId: 'chinook', targetQuantity2047: 25 },
    { equipmentId: 'c17', targetQuantity2047: 15 }, // expanded strategic airlift
    { equipmentId: 'c130j', targetQuantity2047: 18 },
    { equipmentId: 'heron_tp', targetQuantity2047: 60 }, // expanded UAV fleet
    // Army — rebalance: fewer T-72 replacements, more precision strike & lighter forces
    { equipmentId: 't90', targetQuantity2047: 2000 },
    { equipmentId: 't72', targetQuantity2047: 0 },
    { equipmentId: 'arjun_mk1a', targetQuantity2047: 350 }, // expanded indigenous MBT programme
    { equipmentId: 'zorawar', targetQuantity2047: 500 }, // high-altitude priority
    { equipmentId: 'bmp2', targetQuantity2047: 0 },
    { equipmentId: 'k9_vajra', targetQuantity2047: 400 }, // expanded self-propelled artillery
    { equipmentId: 'bofors_fg', targetQuantity2047: 0 },
    { equipmentId: 'm777', targetQuantity2047: 145 },
    { equipmentId: 'pinaka', targetQuantity2047: 750 }, // major expansion, indigenous priority
    { equipmentId: 's400', targetQuantity2047: 10 }, // 2nd tranche
    { equipmentId: 'spike_atgm', targetQuantity2047: 20000 }, // expanded ATGM inventory
    // Navy — 2.5% GDP enables INL LTPP goals
    { equipmentId: 'ins_vikrant', targetQuantity2047: 1 },
    { equipmentId: 'ins_vikramaditya', targetQuantity2047: 0 },
    { equipmentId: 'iac2', targetQuantity2047: 1 },
    { equipmentId: 'visakhapatnam_class', targetQuantity2047: 7 }, // Project 15B + follow-on (P15C)
    { equipmentId: 'kolkata_class', targetQuantity2047: 3 },
    { equipmentId: 'delhi_class', targetQuantity2047: 0 },
    { equipmentId: 'shivalik_class', targetQuantity2047: 3 },
    { equipmentId: 'nilgiri_class', targetQuantity2047: 7 },
    { equipmentId: 'talwar_class', targetQuantity2047: 6 },
    { equipmentId: 'kamorta_class', targetQuantity2047: 16 }, // P28A + P28B
    { equipmentId: 'vela_class', targetQuantity2047: 6 },
    { equipmentId: 'sindhughosh_class', targetQuantity2047: 0 },
    { equipmentId: 'project75i', targetQuantity2047: 12 }, // P75I (6) + follow-on (6)
    { equipmentId: 'arihant_class', targetQuantity2047: 6 }, // expanded nuclear deterrent
    { equipmentId: 'p8i', targetQuantity2047: 24 },
    { equipmentId: 'mh60r', targetQuantity2047: 40 },
  ],
  orders: [], // computed by engine
  budgetConstraint: {
    gdpPercentageCap: 2.5,
  },
  assumptionOverrides: {
    gdpGrowthRatePercent: 6.5,
  },
  createdAt: '2026-04-16T00:00:00Z',
  updatedAt: '2026-04-16T00:00:00Z',
};
