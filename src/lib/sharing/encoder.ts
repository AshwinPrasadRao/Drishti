'use client';
import { deflate, inflate } from 'fflate';
import type { ProjectionConfig } from '@/types/projection';

type MinimalPayload = {
  v: number;
  n: string;
  d?: string;
  al?: string;
  t: [string, number][];
  bc?: { gdp?: number; cap?: number };
  ao?: Record<string, number>;
  ca: string;
  id: string;
};

function toMinimal(config: ProjectionConfig): MinimalPayload {
  return {
    v: 1,
    id: config.id,
    n: config.name,
    d: config.description,
    al: config.authorLabel,
    t: config.targets.map((t) => [t.equipmentId, t.targetQuantity2047]),
    bc: config.budgetConstraint
      ? {
          gdp: config.budgetConstraint.gdpPercentageCap,
          cap: config.budgetConstraint.annualBudgetCapCrore,
        }
      : undefined,
    ao: config.assumptionOverrides as Record<string, number> | undefined,
    ca: config.createdAt,
  };
}

export function encodeProjection(config: ProjectionConfig): Promise<string> {
  return new Promise((resolve, reject) => {
    const json = JSON.stringify(toMinimal(config));
    const bytes = new TextEncoder().encode(json);
    deflate(bytes, { level: 6 }, (err, result) => {
      if (err) return reject(err);
      const b64 = btoa(String.fromCharCode(...result))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      resolve(b64);
    });
  });
}

export function decodeProjection(encoded: string): Promise<Partial<ProjectionConfig>> {
  return new Promise((resolve, reject) => {
    try {
      const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      inflate(bytes, (err, result) => {
        if (err) return reject(err);
        const json = new TextDecoder().decode(result);
        const payload: MinimalPayload = JSON.parse(json);
        if (payload.v !== 1) return reject(new Error('Unknown schema version'));
        const config: Partial<ProjectionConfig> = {
          schemaVersion: 1,
          id: payload.id,
          name: payload.n,
          description: payload.d,
          authorLabel: payload.al,
          scenarioType: 'custom',
          targets: payload.t.map(([equipmentId, targetQuantity2047]) => ({
            equipmentId,
            targetQuantity2047,
          })),
          orders: [],
          budgetConstraint: payload.bc
            ? {
                gdpPercentageCap: payload.bc.gdp,
                annualBudgetCapCrore: payload.bc.cap,
              }
            : undefined,
          assumptionOverrides: payload.ao as ProjectionConfig['assumptionOverrides'],
          createdAt: payload.ca,
          updatedAt: new Date().toISOString(),
        };
        resolve(config);
      });
    } catch (e) {
      reject(e);
    }
  });
}
