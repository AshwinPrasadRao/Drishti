// India GDP projections 2024–2047
// Source: IMF World Economic Outlook (Apr 2024) baseline + extrapolation at 6.5% real growth
// All values in INR Crore at *constant 2024 prices*, to match the rest of the
// projection engine (equipment costs, pay/pension, procurement) which are also
// modelled in constant 2024 ₹. Mixing nominal GDP with real defence outlays
// produces a meaningless % GDP ratio.

export interface GDPEntry {
  year: number;
  gdpCrore: number; // constant-2024 INR Crore
  gdpUSDTrillion: number;
}

// Base: India GDP 2024 ≈ $3.75T × ₹84/USD ≈ ₹3.15×10¹⁴ ≈ ₹3,15,00,000 Cr (315 lakh crore)
// Real growth 6.5%/yr (constant 2024 ₹).
const BASE_YEAR = 2024;
const BASE_GDP_CRORE = 31_500_000;
const REAL_GROWTH_RATE = 0.065;

function buildGDPProjections(): GDPEntry[] {
  const entries: GDPEntry[] = [];
  for (let year = 2024; year <= 2047; year++) {
    const gdpCrore = Math.round(
      BASE_GDP_CRORE * Math.pow(1 + REAL_GROWTH_RATE, year - BASE_YEAR)
    );
    entries.push({
      year,
      gdpCrore,
      gdpUSDTrillion: parseFloat((gdpCrore / 84 / 100_000).toFixed(2)),
    });
  }
  return entries;
}

export const GDP_PROJECTIONS: GDPEntry[] = buildGDPProjections();

export const GDP_BY_YEAR: Record<number, GDPEntry> = Object.fromEntries(
  GDP_PROJECTIONS.map((e) => [e.year, e])
);
