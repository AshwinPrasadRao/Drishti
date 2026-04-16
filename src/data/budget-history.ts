// India Defence Budget History 2010–2026
// Source: Ministry of Defence Annual Reports, Union Budget documents
// All values in INR Crore (nominal)

export interface BudgetHistoryEntry {
  year: number; // Financial year (year of April start, e.g. 2024 = FY2024-25)
  totalBudgetCrore: number;
  capitalBudgetCrore: number; // Modernisation / procurement
  revenueBudgetCrore: number; // Salaries, maintenance, operations
  pensionBudgetCrore: number;
  gdpPercent: number;
}

export const BUDGET_HISTORY: BudgetHistoryEntry[] = [
  { year: 2010, totalBudgetCrore: 147344, capitalBudgetCrore: 52660, revenueBudgetCrore: 94684, pensionBudgetCrore: 28000, gdpPercent: 2.41 },
  { year: 2011, totalBudgetCrore: 164415, capitalBudgetCrore: 60595, revenueBudgetCrore: 103820, pensionBudgetCrore: 31000, gdpPercent: 2.38 },
  { year: 2012, totalBudgetCrore: 193407, capitalBudgetCrore: 79579, revenueBudgetCrore: 113828, pensionBudgetCrore: 35000, gdpPercent: 2.40 },
  { year: 2013, totalBudgetCrore: 203672, capitalBudgetCrore: 86741, revenueBudgetCrore: 116931, pensionBudgetCrore: 40000, gdpPercent: 2.35 },
  { year: 2014, totalBudgetCrore: 224000, capitalBudgetCrore: 94588, revenueBudgetCrore: 129412, pensionBudgetCrore: 46000, gdpPercent: 2.29 },
  { year: 2015, totalBudgetCrore: 246727, capitalBudgetCrore: 94588, revenueBudgetCrore: 152139, pensionBudgetCrore: 54500, gdpPercent: 2.27 },
  { year: 2016, totalBudgetCrore: 254000, capitalBudgetCrore: 86340, revenueBudgetCrore: 167660, pensionBudgetCrore: 60000, gdpPercent: 2.20 },
  { year: 2017, totalBudgetCrore: 274114, capitalBudgetCrore: 86488, revenueBudgetCrore: 187626, pensionBudgetCrore: 71000, gdpPercent: 2.16 },
  { year: 2018, totalBudgetCrore: 295511, capitalBudgetCrore: 99563, revenueBudgetCrore: 195948, pensionBudgetCrore: 85740, gdpPercent: 2.11 },
  { year: 2019, totalBudgetCrore: 317251, capitalBudgetCrore: 103394, revenueBudgetCrore: 213857, pensionBudgetCrore: 112080, gdpPercent: 2.04 },
  { year: 2020, totalBudgetCrore: 365457, capitalBudgetCrore: 113734, revenueBudgetCrore: 251723, pensionBudgetCrore: 133825, gdpPercent: 2.10 },
  { year: 2021, totalBudgetCrore: 478196, capitalBudgetCrore: 135060, revenueBudgetCrore: 343136, pensionBudgetCrore: 119696, gdpPercent: 2.15 },
  { year: 2022, totalBudgetCrore: 525166, capitalBudgetCrore: 152369, revenueBudgetCrore: 372797, pensionBudgetCrore: 119696, gdpPercent: 2.04 },
  { year: 2023, totalBudgetCrore: 593537, capitalBudgetCrore: 180000, revenueBudgetCrore: 413537, pensionBudgetCrore: 138205, gdpPercent: 1.98 },
  { year: 2024, totalBudgetCrore: 621541, capitalBudgetCrore: 172000, revenueBudgetCrore: 449541, pensionBudgetCrore: 141205, gdpPercent: 1.90 },
  { year: 2025, totalBudgetCrore: 681210, capitalBudgetCrore: 195722, revenueBudgetCrore: 485488, pensionBudgetCrore: 155473, gdpPercent: 1.90 },
];
