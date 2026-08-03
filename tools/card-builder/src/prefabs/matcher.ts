import { PREFAB_CATALOG, getPrefabById, prefabsForScope } from './catalog';
import type { EffectKind, MatchedPrefab, PrefabDefinition, PrefabScope, SelectedPrefab } from '../types';

export class MissingPrefabError extends Error {
  constructor(text: string) {
    super(`cannot generate - missing prefab\n\nNo prefab found for effect text:\n"${text}"`);
    this.name = 'MissingPrefabError';
  }
}

/** Normalize card text for pattern matching. */
export function normalizeEffectText(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/Pokémon/gi, 'Pokemon')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split effect text into matchable clauses.
 * Prefers full-text compound matches first; falls back to sentence segments.
 */
function splitClauses(normalized: string): string[] {
  // Keep common compound openers together — matcher tries full text first.
  const parts = normalized
    .split(/(?<=\.)\s+/)
    .map(s => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [normalized];
}

function tryMatchPrefab(
  clause: string,
  prefab: PrefabDefinition
): MatchedPrefab | null {
  for (const pattern of prefab.patterns) {
    const match = clause.match(pattern);
    if (!match) continue;

    const params: Record<string, string> = {};
    for (const p of prefab.params) {
      if (p.defaultValue !== undefined) {
        params[p.key] = String(p.defaultValue);
      }
    }
    if (prefab.paramCaptures) {
      for (const [groupIdx, key] of Object.entries(prefab.paramCaptures)) {
        const captured = match[Number(groupIdx)];
        if (captured !== undefined) {
          params[key] = captured;
        }
      }
    }
    // First DRAW_CARDS pattern has no capture — leave default 1
    if (prefab.id === 'DRAW_CARDS' && !match[1]) {
      params.count = '1';
    }
    if (prefab.id === 'DISCARD_X_ENERGY_FROM_THIS_POKEMON' && !match[1]) {
      params.count = '1';
    }

    return { prefab, params, matchedText: clause };
  }
  return null;
}

function catalogForScope(scope: EffectKind): PrefabDefinition[] {
  return prefabsForScope(scope);
}

/**
 * Match effect text against the prefab catalog.
 * Empty / whitespace-only text is treated as "no effect" (OK).
 * Throws MissingPrefabError if any clause cannot be matched.
 */
export function matchEffectText(
  text: string,
  scope: EffectKind
): MatchedPrefab[] {
  let normalized = normalizeEffectText(text);
  if (!normalized) {
    return [];
  }

  const catalog = catalogForScope(scope);
  const results: MatchedPrefab[] = [];

  // Powers often start with "Once during your turn, ..."
  if (scope === 'power') {
    const once = normalized.match(/^once during your turn\.?(?:\s*[,:])?\s*(.*)$/i);
    if (once) {
      const oncePrefab = catalog.find(p => p.id === 'USE_ABILITY_ONCE_PER_TURN');
      if (oncePrefab) {
        results.push({
          prefab: oncePrefab,
          params: { marker: 'ABILITY_USED_MARKER' },
          matchedText: 'Once during your turn.',
        });
      }
      normalized = (once[1] || '').replace(/^[.,:;]+\s*/, '').trim();
      if (!normalized) {
        return results;
      }
    }
  }

  // 1) Try full-text match against longer/compound patterns first
  for (const prefab of catalog) {
    const hit = tryMatchPrefab(normalized, prefab);
    if (hit) {
      return [...results, hit];
    }
  }

  // 2) Split into clauses and match each
  const clauses = splitClauses(normalized);
  if (clauses.length === 1 && results.length === 0) {
    throw new MissingPrefabError(text.trim());
  }
  if (clauses.length === 1 && results.length > 0) {
    // Had "once during your turn" prefix but remainder unmatched
    throw new MissingPrefabError(normalized);
  }

  for (const clause of clauses) {
    let found: MatchedPrefab | null = null;
    for (const prefab of catalog) {
      found = tryMatchPrefab(clause, prefab);
      if (found) break;
    }
    if (!found) {
      throw new MissingPrefabError(clause);
    }
    results.push(found);
  }
  return results;
}

export function matchedToSelected(matched: MatchedPrefab[]): SelectedPrefab[] {
  return matched.map((m, i) => ({
    id: `${m.prefab.id}-${i}-${Date.now()}`,
    prefabId: m.prefab.id,
    params: { ...m.params },
    source: 'matched' as const,
  }));
}

export function createManualSelected(prefabId: string): SelectedPrefab | null {
  const prefab = getPrefabById(prefabId);
  if (!prefab) return null;
  const params: Record<string, string> = {};
  for (const p of prefab.params) {
    if (p.defaultValue !== undefined) {
      params[p.key] = String(p.defaultValue);
    } else {
      params[p.key] = '';
    }
  }
  return {
    id: `${prefabId}-manual-${Date.now()}`,
    prefabId,
    params,
    source: 'manual',
  };
}

export function listCatalog(scope?: PrefabScope): PrefabDefinition[] {
  if (!scope) return PREFAB_CATALOG;
  if (scope === 'both') return PREFAB_CATALOG;
  return prefabsForScope(scope);
}
