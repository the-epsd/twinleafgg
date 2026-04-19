import type { Card } from 'ptcg-server';

const STORAGE_KEY = 'favoriteCards';

export function readFavoriteCards(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

export function writeFavoriteCards(map: Record<string, string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function isFavoriteCard(card: Card): boolean {
  return readFavoriteCards()[card.name] === card.fullName;
}

export function setFavoriteCard(cardName: string, fullName: string): void {
  const m = { ...readFavoriteCards(), [cardName]: fullName };
  writeFavoriteCards(m);
}

export function clearFavoriteCard(cardName: string): void {
  const m = { ...readFavoriteCards() };
  delete m[cardName];
  writeFavoriteCards(m);
}

export function toggleFavoriteCard(card: Card): void {
  if (isFavoriteCard(card)) {
    clearFavoriteCard(card.name);
  } else {
    setFavoriteCard(card.name, card.fullName);
  }
}
