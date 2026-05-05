// Personnel cost projection — Pay + Pension obligations 2026–2047
// Models the structural impact of Central Pay Commissions on the defence
// budget. CPCs are awarded roughly every 10 years; each implementation
// step-up has historically pushed defence revenue + pension expenditure
// up by ~20–25% in nominal terms, with persistent real-term effects.
//
// Base year: FY2025-26 — Pay (revenue, ex-maintenance/ops) ≈ ₹3,30,000 Cr,
// Pension ≈ ₹1,55,473 Cr → combined personnel obligation ≈ ₹4,85,000 Cr.
// We model this in *constant 2024 ₹ Cr* (consistent with the rest of the
// projection engine).
//
// Sources:
//  - Union Budget FY2025-26, Demand for Grants — Defence (Services + Pensions)
//  - 7th CPC Report (2015), MoD Pay & Pension series
//  - PIB release: 8th CPC approval (Jan 2025)

import { PROJECTION_YEARS } from '@/lib/utils';

export interface CentralPayCommission {
  number: number;          // 7, 8, 9, 10
  implementationYear: number; // FY in which payouts begin
  realStepUpPercent: number;  // real (constant-price) one-time uplift
}

// 7th CPC: Jan 2016, ~14% real uplift
// 8th CPC: announced Jan 2025, expected implementation FY2027-28 (delayed past initial 2026)
// 9th CPC: assumed FY2037-38 (10-year cadence)
// 10th CPC: assumed FY2047-48 (just at horizon edge — partial)
export const PAY_COMMISSIONS: CentralPayCommission[] = [
  { number: 8,  implementationYear: 2027, realStepUpPercent: 12 },
  { number: 9,  implementationYear: 2037, realStepUpPercent: 11 },
  { number: 10, implementationYear: 2047, realStepUpPercent: 10 },
];

// Base year (FY2025-26) personnel obligations in constant 2024 ₹ Cr
export const BASE_YEAR = 2025;
export const BASE_PAY_CRORE = 330_000;       // service pay (revenue ex-maint/ops)
export const BASE_PENSION_CRORE = 155_473;   // defence pension head

// Real growth between CPCs:
//  - Pay: ~1.0% real (force structure flat, modest creep, marginal allowances)
//  - Pension: ~3.0% real (OROP indexation, expanding pensioner base outpacing
//    new recruitment as troop strength holds steady).
export const REAL_PAY_GROWTH = 0.010;
export const REAL_PENSION_GROWTH = 0.030;

export interface PersonnelYear {
  year: number;
  payCrore: number;
  pensionCrore: number;
  totalCrore: number;
  cpcEffectiveThisYear?: number; // CPC number if step-up landed this year
}

function buildPersonnelProjection(): PersonnelYear[] {
  let pay = BASE_PAY_CRORE;
  let pension = BASE_PENSION_CRORE;
  const out: PersonnelYear[] = [];

  // Step from BASE_YEAR forward into PROJECTION_YEARS range.
  // PROJECTION_YEARS likely starts at 2026.
  const startYear = BASE_YEAR;
  const endYear = PROJECTION_YEARS[PROJECTION_YEARS.length - 1];

  for (let year = startYear + 1; year <= endYear; year++) {
    pay *= 1 + REAL_PAY_GROWTH;
    pension *= 1 + REAL_PENSION_GROWTH;

    const cpc = PAY_COMMISSIONS.find((c) => c.implementationYear === year);
    if (cpc) {
      const factor = 1 + cpc.realStepUpPercent / 100;
      pay *= factor;
      pension *= factor;
    }

    if (PROJECTION_YEARS.includes(year)) {
      out.push({
        year,
        payCrore: Math.round(pay),
        pensionCrore: Math.round(pension),
        totalCrore: Math.round(pay + pension),
        cpcEffectiveThisYear: cpc?.number,
      });
    }
  }

  return out;
}

export const PERSONNEL_PROJECTION: PersonnelYear[] = buildPersonnelProjection();

export const PERSONNEL_BY_YEAR: Record<number, PersonnelYear> = Object.fromEntries(
  PERSONNEL_PROJECTION.map((p) => [p.year, p])
);
