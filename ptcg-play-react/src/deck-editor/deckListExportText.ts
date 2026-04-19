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
