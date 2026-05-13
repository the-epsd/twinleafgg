import type { DeckSlot } from './types';
import { sortDeckSlots } from './deckRules';

/** `count Name SET number` lines (Angular deck toolbar export); one row per stacked slot. */
export function deckListExportAngularCountedLines(slots: DeckSlot[]): string {
  const cardLines: string[] = [];
  for (const s of sortDeckSlots(slots)) {
    const { card } = s;
    const line = `${s.count} ${card.name} ${card.set} ${card.setNumber}`;
    if (!cardLines.includes(line)) {
      cardLines.push(line);
    }
  }
  return `${cardLines.join('\n')}\n`;
}

/** PTCGO-style counted lines for clipboard export. */
export function deckListExportText(cardNames: string[]): string {
  const counts = new Map<string, number>();
  for (const line of cardNames) {
    const k = line.trim();
    if (!k) {
      continue;
    }
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, n]) => `${n} ${name}`)
    .join('\n');
}
