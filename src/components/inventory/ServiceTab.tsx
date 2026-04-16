'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MilitaryService } from '@/types/equipment';
import { useUIStore } from '@/store/ui-store';

const SERVICES: { value: MilitaryService | 'all'; label: string }[] = [
  { value: 'all', label: 'All Services' },
  { value: 'air_force', label: 'Air Force' },
  { value: 'army', label: 'Army' },
  { value: 'navy', label: 'Navy' },
];

export function ServiceTab() {
  const { selectedService, setSelectedService } = useUIStore();
  return (
    <Tabs value={selectedService} onValueChange={(v) => setSelectedService(v as MilitaryService | 'all')}>
      <TabsList className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] h-9 p-1">
        {SERVICES.map((s) => (
          <TabsTrigger
            key={s.value}
            value={s.value}
            className="text-xs data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white text-[var(--text-secondary)] data-[state=active]:shadow-none rounded-md px-3"
          >
            {s.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
