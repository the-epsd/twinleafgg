import type { CardTarget, DamageMap, DamageTransfer } from 'ptcg-server';
import { PokemonCardList } from 'ptcg-server';
import { mapPokemonItems, type PokemonItem, type PokemonRow } from './pokemonPromptRows';

export function targetsEqual(a: CardTarget, b: CardTarget): boolean {
  return a.player === b.player && a.slot === b.slot && a.index === b.index;
}

export function findItemByTarget(rows: PokemonRow[], target: CardTarget | undefined): PokemonItem | undefined {
  if (target === undefined) {
    return undefined;
  }
  for (const row of rows) {
    for (const item of row.items) {
      if (targetsEqual(item.target, target)) {
        return item;
      }
    }
  }
  return undefined;
}

/** Net damage counters removed vs prompt-open snapshot (×10 steps). Matches remove/add clicks without separate counter state. */
export function computeNetPendingDamageRemoved(rows: PokemonRow[], initialDamageMap: DamageMap[]): number {
  let sum = 0;
  for (const init of initialDamageMap) {
    const item = findItemByTarget(rows, init.target);
    if (item !== undefined) {
      sum += init.damage - item.cardList.damage;
    }
  }
  return sum;
}

export function patchDamageForTarget(
  rows: PokemonRow[],
  target: CardTarget,
  deltaDamage: number,
): PokemonRow[] {
  return mapPokemonItems(rows, (item) => {
    if (!targetsEqual(item.target, target)) {
      return item;
    }
    const cardList = Object.assign(new PokemonCardList(), item.cardList);
    cardList.damage += deltaDamage;
    return { ...item, cardList };
  });
}

export function buildDamageTransfers(rows: PokemonRow[], initialDamageMap: DamageMap[]): DamageTransfer[] {
  const fromItems: PokemonItem[] = [];
  const toItems: PokemonItem[] = [];
  for (const row of rows) {
    for (const item of row.items) {
      const initial = initialDamageMap.find(
        (i) =>
          i.target.player === item.target.player &&
          i.target.slot === item.target.slot &&
          i.target.index === item.target.index,
      );
      if (initial !== undefined) {
        for (let i = initial.damage; i > item.cardList.damage; i -= 10) {
          fromItems.push(item);
        }
        for (let i = initial.damage; i < item.cardList.damage; i += 10) {
          toItems.push(item);
        }
      }
    }
  }
  const results: DamageTransfer[] = [];
  const len = Math.min(fromItems.length, toItems.length);
  for (let i = 0; i < len; i++) {
    results.push({ from: fromItems[i].target, to: toItems[i].target });
  }
  return results;
}

/**
 * Middle value for the Remove/Move damage HUD: for a **source** (not in `blockedFrom`),
 * shows how much damage can still be removed from this Pokémon in context of the prompt
 * — `min(current damage, remaining 10-counter budget × 10)`. For a **destination** (in
 * `blockedFrom`), shows damage **added** this session vs `initialDamageMap`.
 */
export function computeRemoveDamageHudDisplay(
  rows: PokemonRow[],
  selected: PokemonItem | undefined,
  initialDamageMap: DamageMap[],
  blockedFrom: CardTarget[],
  pendingDamage: number,
  maxTransfers: number | undefined,
): number {
  if (selected === undefined) {
    return 0;
  }
  const target = selected.target;
  const cardList = selected.cardList;
  const results = buildDamageTransfers(rows, initialDamageMap);
  const slotsUsed = results.length + Math.round(pendingDamage / 10);
  const fromBlocked = blockedFrom.some((b) => targetsEqual(b, target));

  if (fromBlocked) {
    const initial = initialDamageMap.find((i) => targetsEqual(i.target, target));
    return Math.max(0, cardList.damage - (initial?.damage ?? 0));
  }

  if (maxTransfers === undefined) {
    return cardList.damage;
  }
  const remainingSlots = Math.max(0, maxTransfers - slotsUsed);
  return Math.min(cardList.damage, remainingSlots * 10);
}

export function computeRemoveAddDisabled(
  rows: PokemonRow[],
  selected: PokemonItem | undefined,
  pendingDamage: number,
  maxDamageMap: DamageMap[],
  maxTransfers: number | undefined,
  initialDamageMap: DamageMap[],
  blockedFrom: CardTarget[],
  blockedTo: CardTarget[],
): { remove: boolean; add: boolean } {
  if (selected === undefined) {
    return { remove: true, add: true };
  }
  const target = selected.target;
  const cardList = selected.cardList;
  const damageMap = maxDamageMap.find(
    (d) =>
      d.target.player === target.player && d.target.slot === target.slot && d.target.index === target.index,
  );
  const allowedDamage: number | undefined = damageMap && damageMap.damage;

  const initial = initialDamageMap.find(
    (i) =>
      i.target.player === target.player &&
      i.target.slot === target.slot &&
      i.target.index === target.index,
  );
  const initialDamage = initial?.damage ?? 0;

  const isBlockedFrom = blockedFrom.some((b) => targetsEqual(b, target));
  const isBlockedTo = blockedTo.some((b) => targetsEqual(b, target));

  let isRemoveDisabled = cardList.damage <= 0;
  let isAddDisabled = false;

  /** Opponent (`blockedFrom`): − peels placed counters; cannot strip below snapshot. */
  if (isBlockedFrom) {
    if (cardList.damage <= initialDamage) {
      isRemoveDisabled = true;
    }
  }

  /** Your Pokémon (`blockedTo`): + restores removed counters up to snapshot. */
  if (isBlockedTo) {
    if (cardList.damage >= initialDamage) {
      isAddDisabled = true;
    }
  } else {
    if (pendingDamage === 0 || (allowedDamage !== undefined && cardList.damage >= allowedDamage)) {
      isAddDisabled = true;
    }
  }

  const results = buildDamageTransfers(rows, initialDamageMap);
  const transfers = results.length + Math.round(pendingDamage / 10);
  if (maxTransfers !== undefined && transfers >= maxTransfers && initial !== undefined) {
    if (initial.damage >= cardList.damage) {
      isRemoveDisabled = true;
    }
  }

  return { remove: isRemoveDisabled, add: isAddDisabled };
}

export function computeInvalid(
  rows: PokemonRow[],
  pendingDamage: number,
  initialDamageMap: DamageMap[],
  min: number,
  max: number | undefined,
): boolean {
  const results = buildDamageTransfers(rows, initialDamageMap);
  if (pendingDamage > 0) {
    return true;
  }
  if (min > results.length) {
    return true;
  }
  if (max !== undefined && max < results.length) {
    return true;
  }
  return false;
}
