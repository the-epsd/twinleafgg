import type { EffectKind, HybridEffectResolution, ServerEffect } from './types';
import { matchEffectTextPartial, matchedToSelected } from './prefabs/matcher';

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
  const aNorm = normalize(left);
  const bNorm = normalize(right);
  if (!aNorm || !bNorm) return 0;
  if (aNorm === bNorm) return 1;
  const a = new Set(aNorm.split(/\s+/).filter(Boolean));
  const b = new Set(bNorm.split(/\s+/).filter(Boolean));
  if (a.size === 0 || b.size === 0) return 0;
  let overlap = 0;
  for (const token of a) if (b.has(token)) overlap++;
  return overlap / Math.max(a.size, b.size);
}

function thresholdFor(kind: EffectKind | undefined, clauseMode: boolean): number {
  if (kind === 'energy') return 0.68;
  if (clauseMode) return 0.7;
  return 0.75;
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

export function clearServerEffectsCache(): void {
  cached = null;
}

export interface FindServerEffectOptions {
  /** Lower similarity threshold for short unmatched clauses. */
  clauseMode?: boolean;
  /** Minimum score override. */
  minScore?: number;
}

/**
 * Rank server effects by exact-then-Jaccard similarity.
 * Prefer same kind, higher score, then shorter body (less junk).
 */
export async function findServerEffect(
  text: string,
  kind?: EffectKind,
  options: FindServerEffectOptions = {}
): Promise<ServerEffect | undefined> {
  if (!text.trim()) return undefined;
  const effects = await loadServerEffects();
  const minScore = options.minScore ?? thresholdFor(kind, Boolean(options.clauseMode));
  const ranked = effects
    .filter(effect => !kind || effect.kind === kind || (!effect.kind && kind === 'attack'))
    .map(effect => ({
      effect,
      score: similarity(text, effect.effectText || effect.attackText || ''),
    }))
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.effect.body.length - b.effect.body.length;
    });
  const best = ranked[0];
  if (!best) return undefined;
  return { ...best.effect, similarity: best.score };
}

/**
 * Find a server snippet for each unmatched clause.
 * Returns hits that clear the clause threshold; weak clauses are omitted.
 */
export async function findServerEffectsForClauses(
  clauses: string[],
  kind: EffectKind
): Promise<{ hits: ServerEffect[]; missed: string[] }> {
  const hits: ServerEffect[] = [];
  const missed: string[] = [];
  for (const clause of clauses) {
    const hit = await findServerEffect(clause, kind, { clauseMode: true });
    if (hit) {
      hits.push({ ...hit, matchedClause: clause });
    } else {
      missed.push(clause);
    }
  }
  return { hits, missed };
}

/**
 * Hybrid resolve: prefabs for every matching clause, server snippets for gaps,
 * full-text fallback when almost nothing matched.
 */
export async function resolveEffectHybrid(
  text: string,
  kind: EffectKind
): Promise<HybridEffectResolution> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { selectedPrefabs: [], serverSnippets: [], unmatchedClauses: [] };
  }

  // Energy has no prefab pass
  if (kind === 'energy') {
    const full = await findServerEffect(trimmed, 'energy');
    return {
      selectedPrefabs: [],
      serverSnippets: [],
      serverEffect: full,
      unmatchedClauses: full ? [] : [trimmed],
    };
  }

  const { matched, unmatched } = matchEffectTextPartial(trimmed, kind);
  const selectedPrefabs = matchedToSelected(matched);

  if (unmatched.length === 0) {
    return { selectedPrefabs, serverSnippets: [], unmatchedClauses: [] };
  }

  const { hits, missed } = await findServerEffectsForClauses(unmatched, kind);
  const full = selectedPrefabs.length === 0 ? await findServerEffect(trimmed, kind) : undefined;
  const bestClause = hits.reduce((max, h) => Math.max(max, h.similarity), 0);

  // Prefer a strong full-text match over stitching clauses (avoids orphan TODOs like
  // "Flip a coin." when the matched branch already includes the coin flip).
  if (selectedPrefabs.length === 0 && full && full.similarity >= Math.max(0.85, bestClause)) {
    return {
      selectedPrefabs: [],
      serverSnippets: [],
      serverEffect: full,
      unmatchedClauses: [],
    };
  }

  if (selectedPrefabs.length === 0) {
    if (hits.length === 0 && !full) {
      return {
        selectedPrefabs: [],
        serverSnippets: [],
        unmatchedClauses: unmatched,
      };
    }

    if (hits.length > 0) {
      const coveredUnmatched = filterUnmatchedCoveredBySnippets(missed.length > 0 ? missed : unmatched, hits);
      // Prefer full copy when it beats clause stitching or when leftovers remain
      if (full && (coveredUnmatched.length > 0 || full.similarity >= bestClause)) {
        return {
          selectedPrefabs: [],
          serverSnippets: [],
          serverEffect: full,
          unmatchedClauses: [],
        };
      }
      return {
        selectedPrefabs: [],
        serverSnippets: hits,
        unmatchedClauses: coveredUnmatched,
      };
    }
  }

  // Hybrid: keep prefabs; only attach clause snippets that are strong enough.
  const strongSnippets = hits.filter(h => {
    if (h.similarity >= 0.9) return true;
    if (h.similarity >= 0.75 && h.body.length <= 12) return true;
    return false;
  });
  const strongClauses = new Set(strongSnippets.map(s => s.matchedClause).filter(Boolean));
  const stillUnmatched = filterUnmatchedCoveredBySnippets(
    [
      ...missed,
      ...hits.filter(h => !strongClauses.has(h.matchedClause)).map(h => h.matchedClause || h.effectText),
    ].filter(Boolean) as string[],
    strongSnippets
  );

  if (selectedPrefabs.length === 0 && strongSnippets.length === 0) {
    return {
      selectedPrefabs: [],
      serverSnippets: [],
      serverEffect: full,
      unmatchedClauses: full ? [] : unmatched,
    };
  }

  return {
    selectedPrefabs,
    serverSnippets: strongSnippets,
    unmatchedClauses: stillUnmatched,
  };
}

/** Drop unmatched clauses already covered by a snippet's source effect text. */
function filterUnmatchedCoveredBySnippets(clauses: string[], snippets: ServerEffect[]): string[] {
  if (clauses.length === 0 || snippets.length === 0) return clauses;
  const coveredTexts = snippets.map(s => normalize(s.effectText || s.attackText || ''));
  return clauses.filter(clause => {
    const n = normalize(clause);
    if (!n) return false;
    return !coveredTexts.some(text => text.includes(n) || n.includes(text));
  });
}

/** Format a short status line for the UI. */
export function describeHybridResolution(result: HybridEffectResolution): string {
  const parts: string[] = [];
  if (result.selectedPrefabs.length > 0) {
    parts.push(`${result.selectedPrefabs.length} prefab(s)`);
  }
  if (result.serverEffect) {
    parts.push(
      `full server match from ${result.serverEffect.source} (${Math.round(result.serverEffect.similarity * 100)}%)`
    );
  } else if (result.serverSnippets.length > 0) {
    const snippetDesc = result.serverSnippets
      .map(s => `${s.source} (${Math.round(s.similarity * 100)}%)`)
      .join(', ');
    parts.push(`${result.serverSnippets.length} server snippet(s): ${snippetDesc}`);
  }
  if (result.unmatchedClauses.length > 0) {
    parts.push(`${result.unmatchedClauses.length} unmatched clause(s)`);
  }
  if (parts.length === 0) {
    return 'No effect text — nothing to match (plain damage attack is OK).';
  }
  return `Matched ${parts.join(' + ')}.`;
}
