export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="page-title">About Drishti</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Methodology, sources, and assumptions</p>
      </div>

      <section className="space-y-3">
        <h3 className="section-title">What is Drishti?</h3>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          Drishti is an open, interactive model for India's defence procurement requirements from 2026 to 2047.
          Anyone — veterans, analysts, journalists, citizens — can view India's current military inventory,
          build their own projection of what the armed forces should look like in 2047, see the resulting budget
          impact, and share their projection publicly via a URL.
        </p>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          The goal is to make India's defence planning debate more transparent, evidence-based, and participatory.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="section-title">Data Sources</h3>
        <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
          {[
            ['IISS Military Balance 2024/25', 'Primary source for current inventory quantities for all three services.'],
            ['Ministry of Defence Annual Reports', 'Historical defence budgets, capital allocations, and procurement updates.'],
            ['IMF World Economic Outlook (Apr 2024)', 'India GDP projections to 2029, extrapolated at 6.5% real / 11.5% nominal growth.'],
            ['Takshashila Institution', '"Neither Guns nor Butter" (2022) for defence budget recommendations (2.5% GDP target). takshashila.org.in'],
            ['Indian Navy LTPP', 'Publicly cited fleet goals: 200+ ships by 2035, 24 submarines, carrier programme.'],
            ['SIPRI, Jane\'s, PIB', 'Unit cost estimates and contract value cross-checks.'],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-3">
              <span className="text-[var(--brand)] mt-0.5 flex-shrink-0">•</span>
              <span>
                <strong className="text-[var(--text-primary)] font-medium">{title}</strong>
                {' — '}{desc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="section-title">Key Assumptions</h3>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 divide-y divide-[var(--border-subtle)]">
          {[
            ['Quantities', 'All inventory figures are open-source IISS estimates. Actual classified inventories may differ significantly.'],
            ['Unit costs', 'Order-of-magnitude estimates (±20–30%) based on reported contract values. Actual costs vary with avionics fit, ToT clauses, and FMS vs direct purchase.'],
            ['Maintenance', 'Modelled at 6.5% of unit procurement cost per year. Actual figures vary by platform and operating environment.'],
            ['Lead times', 'Approximate. Large programmes routinely slip 2–5 years. Costs are spread across lead time using an S-curve (15% mobilisation, 70% construction, 15% delivery).'],
            ['GDP projections', 'IMF baseline + extrapolation. Actual growth could differ materially over 20 years.'],
            ['Exchange rate', 'Fixed at ₹84/USD (constant 2024 prices). Future currency movements not modelled.'],
            ['R&D costs', 'Not included. DRDO and HAL programme development costs are not modelled.'],
            ['Mid-life upgrades', 'Not modelled. Upgrades extending service life beyond stated expectancy are not accounted for.'],
          ].map(([label, text]) => (
            <div key={label} className="flex gap-3 py-2.5 text-sm first:pt-0 last:pb-0">
              <span className="text-[var(--brand)] font-medium flex-shrink-0 w-28">{label}</span>
              <span className="text-[var(--text-secondary)]">{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="section-title">Cost Model</h3>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          When you set a target (e.g., "3 carriers by 2036"), the engine determines the order year
          (delivery year minus lead time) and spreads the total cost across years using an S-curve:
          15% at contract signing, 70% evenly across construction years, and 15% on delivery acceptance.
          This reflects how large defence programmes actually pay out — budget pressure starts years before delivery.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="section-title">Takshashila Projection</h3>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          The Takshashila-informed projection is constructed from their published research — primarily the
          "Neither Guns nor Butter" (2022) chapter recommending a 2.5% GDP defence budget — combined with
          the Indian Navy's own Long Term Perspective Plan goals. Takshashila has not officially endorsed
          the specific platform numbers in this projection. We welcome their review and correction.
        </p>
      </section>

      <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
        <p className="text-[var(--text-tertiary)] text-sm leading-relaxed">
          Drishti is an independent, non-partisan public interest project. It is not affiliated with the
          Government of India, Ministry of Defence, or any armed service.
          Data and projections are for analytical and educational purposes only.
        </p>
      </div>
    </div>
  );
}
