import type { Card, EnergyCard, PokemonCard } from 'ptcg-server';
import { CardTag, CardType, EnergyType, SuperType } from 'ptcg-server';
import type { DeckSlot } from './types';

export function isBasicEnergy(card: Card): boolean {
  return card.superType === SuperType.ENERGY && (card as EnergyCard).energyType === EnergyType.BASIC;
}

export function getSameNameCount(slots: DeckSlot[], cardName: string): number {
  return slots.filter((i) => i.card.name === cardName).reduce((sum, i) => sum + i.count, 0);
}

export type CanAddResult = { ok: true } | { ok: false; reason: string };

export type AddCardResult = { ok: true; slots: DeckSlot[] } | { ok: false; reason: string };

function compareSupertype(input: SuperType): number {
  if (input === SuperType.POKEMON) {
    return 1;
  }
  if (input === SuperType.TRAINER) {
    return 2;
  }
  if (input === SuperType.ENERGY) {
    return 3;
  }
  return Infinity;
}

function compareCardType(cardType: CardType): number {
  const order = [
    CardType.GRASS,
    CardType.FIRE,
    CardType.WATER,
    CardType.LIGHTNING,
    CardType.PSYCHIC,
    CardType.FIGHTING,
    CardType.DARK,
    CardType.METAL,
    CardType.COLORLESS,
    CardType.FAIRY,
    CardType.DRAGON,
  ];
  return order.indexOf(cardType);
}

/** Order slots by Pokémon type, then Trainer, Energy, and name. */
export function sortDeckSlots(slots: DeckSlot[]): DeckSlot[] {
  return slots.slice().sort((a, b) => {
    const sup = compareSupertype(a.card.superType) - compareSupertype(b.card.superType);
    if (sup !== 0) {
      return sup;
    }
    if (a.card.superType === SuperType.POKEMON && b.card.superType === SuperType.POKEMON) {
      const ta = (a.card as PokemonCard).cardType;
      const tb = (b.card as PokemonCard).cardType;
      const tc = compareCardType(ta) - compareCardType(tb);
      if (tc !== 0) {
        return tc;
      }
    }
    return a.card.fullName.localeCompare(b.card.fullName);
  });
}

export function canAddOne(slots: DeckSlot[], card: Card): CanAddResult {
  if (card.tags.includes(CardTag.ACE_SPEC)) {
    const aceSpecCount = slots.filter((c) => c.card.tags.includes(CardTag.ACE_SPEC)).reduce((s, c) => s + c.count, 0);
    if (aceSpecCount >= 1) {
      return { ok: false, reason: 'Only one ACE SPEC card per deck.' };
    }
  }
  if (card.tags.includes(CardTag.RADIANT)) {
    const radiantCount = slots.filter((c) => c.card.tags.includes(CardTag.RADIANT)).reduce((s, c) => s + c.count, 0);
    if (radiantCount >= 1) {
      return { ok: false, reason: 'Only one Radiant Pokémon per deck.' };
    }
  }
  if (card.tags.includes(CardTag.PRISM_STAR)) {
    const prism = slots.find((c) => c.card.fullName === card.fullName);
    const prismCount = prism ? prism.count : 0;
    if (prismCount >= 1) {
      return { ok: false, reason: 'Only one copy of each Prism Star card.' };
    }
  }
  if (!isBasicEnergy(card) && getSameNameCount(slots, card.name) >= 4) {
    return { ok: false, reason: 'Maximum 4 copies per card name (except basic Energy).' };
  }
  return { ok: true };
}


function insertOrdered(list: DeckSlot[], newSlot: DeckSlot): DeckSlot[] {
  const sorted = sortDeckSlots(list);
  let insertIndex = sorted.length;
  for (let i = 0; i < sorted.length; i++) {
    const result = compareSupertype(newSlot.card.superType) - compareSupertype(sorted[i].card.superType);
    if (result < 0) {
      insertIndex = i;
      break;
    }
    if (result === 0 && newSlot.card.superType === SuperType.POKEMON) {
      const itemCard = newSlot.card as PokemonCard;
      const listCard = sorted[i].card as PokemonCard;
      const typeCompare = compareCardType(itemCard.cardType) - compareCardType(listCard.cardType);
      if (typeCompare < 0) {
        insertIndex = i;
        break;
      }
    }
  }
  const next = sorted.slice();
  next.splice(insertIndex, 0, newSlot);
  return sortDeckSlots(next);
}

export function addCardToDeck(slots: DeckSlot[], card: Card): AddCardResult {
  const gate = canAddOne(slots, card);
  if (!gate.ok) {
    return gate;
  }
  const idx = slots.findIndex((c) => c.card.fullName === card.fullName);
  if (idx === -1) {
    return { ok: true, slots: insertOrdered(slots, { card, count: 1 }) };
  }
  const next = slots.map((s, i) => (i === idx ? { ...s, count: s.count + 1 } : s));
  if (!isBasicEnergy(card) && getSameNameCount(next, card.name) > 4) {
    return { ok: false, reason: 'Maximum 4 copies per card name (except basic Energy).' };
  }
  return { ok: true, slots: sortDeckSlots(next) };
}

export function removeOneCopy(slots: DeckSlot[], fullName: string): DeckSlot[] {
  const idx = slots.findIndex((c) => c.card.fullName === fullName);
  if (idx === -1) {
    return slots;
  }
  const next = slots.slice();
  if (next[idx].count <= 1) {
    next.splice(idx, 1);
  } else {
    next[idx] = { ...next[idx], count: next[idx].count - 1 };
  }
  return sortDeckSlots(next);
}

export function flatNamesFromSlots(slots: DeckSlot[]): string[] {
  return slots.flatMap((s) => Array.from({ length: s.count }, () => s.card.fullName));
}

export function slotsFromFlatNames(flat: string[], byFullName: Map<string, Card>): {
  slots: DeckSlot[];
  unknown: string[];
} {
  const unknown: string[] = [];
  const counts = new Map<string, number>();
  for (const line of flat) {
    const key = line.trim();
    if (!key) {
      continue;
    }
    if (!byFullName.has(key)) {
      unknown.push(key);
      continue;
    }
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const slots: DeckSlot[] = [];
  for (const [fullName, count] of counts) {
    const card = byFullName.get(fullName);
    if (card) {
      slots.push({ card, count });
    }
  }
  return { slots: sortDeckSlots(slots), unknown };
}

export function reorderSlots(slots: DeckSlot[], activeId: string, overId: string): DeckSlot[] {
  const oldIndex = slots.findIndex((s) => s.card.fullName === activeId);
  const newIndex = slots.findIndex((s) => s.card.fullName === overId);
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return slots;
  }
  const next = slots.slice();
  const [moved] = next.splice(oldIndex, 1);
  next.splice(newIndex, 0, moved);
  return next;
}

/** Replace one printing with another; merges stacks if the new fullName already exists. */
export function replaceSlotCard(slots: DeckSlot[], originalFullName: string, newCard: Card): DeckSlot[] {
  const mapped = slots.map((s) =>
    s.card.fullName === originalFullName ? { ...s, card: newCard } : { ...s },
  );
  const merged = new Map<string, DeckSlot>();
  for (const s of mapped) {
    const prev = merged.get(s.card.fullName);
    if (prev) {
      merged.set(s.card.fullName, { card: s.card, count: prev.count + s.count });
    } else {
      merged.set(s.card.fullName, s);
    }
  }
  return sortDeckSlots([...merged.values()]);
}
