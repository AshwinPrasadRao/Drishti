'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProjectionStore } from '@/store/projection-store';
import { BASELINE_PROJECTION } from '@/data/projections/baseline-projection';
import { TAKSHASHILA_PROJECTION } from '@/data/projections/takshashila-projection';
import type { ProjectionConfig } from '@/types/projection';
import Link from 'next/link';

const CURATED: ProjectionConfig[] = [BASELINE_PROJECTION, TAKSHASHILA_PROJECTION];

const SCENARIO_BADGE: Record<string, string> = {
  baseline:     'border-[var(--border-strong)] text-[var(--text-secondary)]',
  takshashila:  'border-blue-500/50 text-blue-400',
  custom:       'border-[var(--brand-border)] text-[var(--brand)]',
};

export default function GalleryPage() {
  const [userProjections, setUserProjections] = useState<ProjectionConfig[]>([]);
  const loadConfig = useProjectionStore((s) => s.loadConfig);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('drishti:projections:v1') ?? '[]');
      setUserProjections(stored);
    } catch {}
  }, []);

  const all = [...CURATED, ...userProjections];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Projections Gallery</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Browse, load, and compare defence projections.
          </p>
        </div>
        <Link href="/projections/builder">
          <Button className="bg-[var(--brand)] hover:bg-orange-600 text-white h-8 text-xs px-4">
            + New Projection
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {all.map((proj) => (
          <div
            key={proj.id}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3 hover:border-[var(--border-default)] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[var(--text-primary)] font-semibold text-sm">{proj.name}</p>
              <Badge
                variant="outline"
                className={`text-xs flex-shrink-0 ${SCENARIO_BADGE[proj.scenarioType] ?? ''}`}
              >
                {proj.scenarioType}
              </Badge>
            </div>
            {proj.description && (
              <p className="text-[var(--text-secondary)] text-xs line-clamp-3 leading-relaxed">{proj.description}</p>
            )}
            {proj.authorLabel && (
              <p className="text-[var(--text-tertiary)] text-xs">by {proj.authorLabel}</p>
            )}
            {proj.budgetConstraint?.gdpPercentageCap && (
              <p className="text-[var(--text-tertiary)] text-xs">
                Budget cap: {proj.budgetConstraint.gdpPercentageCap}% GDP
              </p>
            )}
            <Link href="/projections/builder">
              <Button
                size="sm"
                variant="outline"
                className="w-full border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] h-8 text-xs mt-1"
                onClick={() => loadConfig(proj)}
              >
                Load Projection
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {userProjections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)] text-sm">No saved projections yet.</p>
          <p className="text-[var(--text-tertiary)] text-xs mt-1">
            Build one in the Projection Builder and save it.
          </p>
        </div>
      )}
    </div>
  );
}
