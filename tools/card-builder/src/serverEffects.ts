import type { EffectKind, ServerEffect } from './types';

let cached: ServerEffect[] | null = null;

function normalize(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/Pokémon/gi, 'Pokemon')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();
}

function similarity(left: string, right: string): number {
  const a = new Set(normalize(left).split(/\s+/).filter(Boolean));
  const b = new Set(normalize(right).split(/\s+/).filter(Boolean));
  if (a.size === 0 || b.size === 0) return 0;
  let overlap = 0;
  for (const token of a) if (b.has(token)) overlap++;
  return overlap / Math.max(a.size, b.size);
}

export async function loadServerEffects(): Promise<ServerEffect[]> {
  if (cached) return cached;
  const response = await fetch('/server-card-effects.json');
  if (!response.ok) {
    throw new Error(`Failed to load server card effects (${response.status})`);
  }
  cached = (await response.json()) as ServerEffect[];
  return cached;
}

export async function findServerEffect(text: string, kind?: EffectKind): Promise<ServerEffect | undefined> {
  if (!text.trim()) return undefined;
  const effects = await loadServerEffects();
  const ranked = effects
    .filter(effect => !kind || effect.kind === kind || (!effect.kind && kind === 'attack'))
    .map(effect => ({ effect, score: similarity(text, effect.effectText || effect.attackText || '') }))
    .filter(({ score }) => score >= (kind === 'energy' ? 0.68 : 0.75))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best) return undefined;
  return { ...best.effect, similarity: best.score };
}
