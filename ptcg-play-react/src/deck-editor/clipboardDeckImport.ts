import type { Card } from 'ptcg-server';
import { cardReplacements, setCodeReplacements } from './card-replacements';
import { isBasicEnergy } from './deckRules';

export type ClipboardImportResult = {
  flatFullNames: string[];
  /** PTCGO lines that resolved to zero cards ({name} {set} {setNumber}); values are occurrences. */
  ptcgoFailureCounts: Map<string, number>;
  /** Fallback path: lines that never resolved to full names */
  fallbackUnknown: string[];
};

function normalizeImportedSetCode(setCode: string): string {
  const normalizedCode = (setCode || '').trim().toUpperCase();
  if (!normalizedCode) {
    return setCode;
  }
  let mappedCode = normalizedCode;
  for (const replacement of setCodeReplacements) {
    if (replacement.from.toUpperCase() === mappedCode) {
      mappedCode = replacement.to.toUpperCase();
    }
  }
  return mappedCode;
}

function applyCardNameReplacementsForImport(name: string): string {
  let processedName = name;
  for (const replacement of cardReplacements) {
    processedName = processedName.replace(
      new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      replacement.to,
    );
  }
  return processedName;
}

function getCardByNameSetNumber(cards: Card[], name: string, set: string, setNumber: string): Card | undefined {
  return cards.find((c) => c.name === name && c.set === set && c.setNumber === setNumber);
}

function getCardByNameSet(cards: Card[], name: string, set: string): Card | undefined {
  return cards.find((c) => c.name === name && c.set === set);
}

function getCardByBaseName(cards: Card[], name: string): Card | undefined {
  return cards.find((c) => c.name === name);
}

function resolvePtcgoEntry(
  name: string,
  setRaw: string,
  setNumber: string,
  cards: Card[],
  byFullName: Map<string, Card>,
  favoriteMap: Record<string, string>,
): Card | undefined {
  const normalizedSet = normalizeImportedSetCode(setRaw);
  const processedName = applyCardNameReplacementsForImport(name);
  let foundCard =
    getCardByNameSetNumber(cards, processedName, normalizedSet, setNumber) ??
    getCardByNameSet(cards, processedName, normalizedSet) ??
    getCardByBaseName(cards, processedName);

  if (foundCard) {
    const favoriteFullName = favoriteMap[processedName];
    if (favoriteFullName) {
      const favoriteCard = byFullName.get(favoriteFullName);
      if (favoriteCard) {
        foundCard = favoriteCard;
      }
    }
  }
  return foundCard;
}

function resolveProbeToFullName(probe: string, byFullName: Map<string, Card>): string | null {
  const t = probe.trim();
  if (!t) {
    return null;
  }
  if (byFullName.has(t)) {
    return t;
  }
  const lower = t.toLowerCase();
  for (const c of byFullName.values()) {
    if (c.name.toLowerCase() === lower) {
      return c.fullName;
    }
  }
  return null;
}

/** Fallback: counted full-name / base-name lines like the legacy React importer. */
function fallbackLineToRepeatedFullNames(line: string, byFullName: Map<string, Card>): string[] | null {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }
  const m = trimmed.match(/^(\d+)\s+(.+)$/);
  const probe = m ? m[2]!.trim() : trimmed;
  const resolved = resolveProbeToFullName(probe, byFullName);
  if (!resolved) {
    return null;
  }
  const n = m ? Math.min(1000, Math.max(1, parseInt(m[1]!, 10))) : 1;
  return Array.from({ length: n }, () => resolved);
}

/** Match Angular capCardsByByName (basic Energy exempt). */
function capFlatFullNamesByCardName(flat: string[], byFullName: Map<string, Card>, maxPerName: number): string[] {
  const nameCount = new Map<string, number>();
  const result: string[] = [];
  for (const fullName of flat) {
    const card = byFullName.get(fullName);
    if (!card) {
      continue;
    }
    if (isBasicEnergy(card)) {
      result.push(fullName);
      continue;
    }
    const count = nameCount.get(card.name) ?? 0;
    if (count < maxPerName) {
      result.push(fullName);
      nameCount.set(card.name, count + 1);
    }
  }
  return result;
}

/**
 * Clipboard text → flat full-name list aligned with Angular `parseClipboardLines` + `importDeck`.
 * Lines with ≥4 tokens and a numeric leading count use PTCGO resolution; otherwise the legacy fallback path applies.
 */
export function clipboardImportFromText(
  text: string,
  cards: Card[],
  byFullName: Map<string, Card>,
  favoriteMap: Record<string, string>,
): ClipboardImportResult {
  const ptcgoFailureCounts = new Map<string, number>();
  const fallbackUnknown: string[] = [];
  const flatUnsorted: string[] = [];

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const parts = line.split(/\s+/);
    const countLeading = parseInt(parts[0]!, 10);
    const countTokenValid = /^[0-9]+$/.test(parts[0]!);
    const isPtcgo = parts.length >= 4 && countTokenValid && !Number.isNaN(countLeading);

    if (isPtcgo) {
      const count = Math.min(1000, Math.max(1, countLeading));
      const partsCopy = parts.slice();
      const setNumber = partsCopy.pop()!;
      const set = partsCopy.pop()!;
      const name = partsCopy.slice(1).join(' ');

      for (let i = 0; i < count; i++) {
        const found = resolvePtcgoEntry(name, set, setNumber, cards, byFullName, favoriteMap);
        if (found) {
          flatUnsorted.push(found.fullName);
        } else {
          const key = `${name} ${set} ${setNumber}`;
          ptcgoFailureCounts.set(key, (ptcgoFailureCounts.get(key) ?? 0) + 1);
        }
      }
      continue;
    }

    const repeated = fallbackLineToRepeatedFullNames(line, byFullName);
    if (repeated?.length) {
      flatUnsorted.push(...repeated);
    } else {
      fallbackUnknown.push(line);
    }
  }

  const flatFullNames = capFlatFullNamesByCardName(flatUnsorted, byFullName, 4);

  return { flatFullNames, ptcgoFailureCounts, fallbackUnknown };
}

export function formatPtcgoImportFailures(fc: Map<string, number>): string[] {
  return [...fc.entries()].map(([k, n]) => `${n} ${k}`);
}
