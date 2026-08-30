const STORAGE_KEY = 'effectlessCardsTested';

export function readTestedCards(): Set<string> {
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

export function writeTestedCards(tested: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...tested]));
}

export function toggleTestedCard(fullName: string): Set<string> {
  const next = readTestedCards();
  if (next.has(fullName)) {
    next.delete(fullName);
  } else {
    next.add(fullName);
  }
  writeTestedCards(next);
  return next;
}
