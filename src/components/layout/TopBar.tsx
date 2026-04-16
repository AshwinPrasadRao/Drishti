'use client';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useProjectionStore } from '@/store/projection-store';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Current Inventory',
  '/projections': 'Projections Gallery',
  '/projections/builder': 'Projection Builder',
  '/budget': 'Budget Model',
  '/compare': 'Compare Projections',
  '/about': 'About & Sources',
};

const SCENARIO_BADGE: Record<string, string> = {
  baseline: 'border-[var(--border-strong)] text-[var(--text-secondary)]',
  takshashila: 'border-blue-500/50 text-blue-400',
  custom: 'border-[var(--brand-border)] text-[var(--brand)]',
};

export function TopBar() {
  const pathname = usePathname();
  const active = useProjectionStore((s) => s.active);
  const isDirty = useProjectionStore((s) => s.isDirty);

  const title = PAGE_TITLES[pathname] ?? 'Drishti';

  return (
    <header className="h-13 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-sm flex items-center px-6 gap-4 flex-shrink-0">
      <h1 className="text-[var(--text-primary)] font-semibold text-sm tracking-tight">{title}</h1>

      {active && (
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[var(--text-tertiary)] text-xs hidden sm:block truncate max-w-48">
            {active.config.name}
          </span>
          <Badge
            variant="outline"
            className={SCENARIO_BADGE[active.config.scenarioType] ?? ''}
          >
            {active.config.scenarioType === 'baseline'
              ? 'Baseline'
              : active.config.scenarioType === 'takshashila'
              ? 'Takshashila'
              : 'Custom'}
          </Badge>
          {isDirty && (
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
              Unsaved
            </Badge>
          )}
        </div>
      )}
    </header>
  );
}
