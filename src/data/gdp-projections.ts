// India GDP projections 2024–2047
// Source: IMF World Economic Outlook (Apr 2024) baseline + extrapolation at 6.5% real growth
// All values in INR Crore (nominal, approx ₹84/USD)
// Note: These are illustrative projections; actual GDP will differ.

export interface GDPEntry {
  year: number;
  gdpCrore: number; // nominal INR Crore
  gdpUSDTrillion: number;
}

// Base: India GDP 2024 ≈ $3.75T ≈ ₹3,150,000 Cr
// Nominal growth ≈ 11.5%/yr (6.5% real + ~5% inflation)
const BASE_YEAR = 2024;
const BASE_GDP_CRORE = 3_150_000;
const NOMINAL_GROWTH_RATE = 0.115;

function buildGDPProjections(): GDPEntry[] {
  const entries: GDPEntry[] = [];
  for (let year = 2024; year <= 2047; year++) {
    const gdpCrore = Math.round(
      BASE_GDP_CRORE * Math.pow(1 + NOMINAL_GROWTH_RATE, year - BASE_YEAR)
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
