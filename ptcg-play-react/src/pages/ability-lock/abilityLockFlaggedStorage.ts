const STORAGE_KEY = 'abilityLockFlaggedCards';

export function readFlaggedCards(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((v): v is string => typeof v === 'string'));
  } catch {
    return new Set();
  }
}

export function writeFlaggedCards(flagged: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...flagged]));
}

export function toggleFlaggedCard(fullName: string): Set<string> {
  const next = readFlaggedCards();
  if (next.has(fullName)) {
    next.delete(fullName);
  } else {
    next.add(fullName);
  }
  writeFlaggedCards(next);
  return next;
}
