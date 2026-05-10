import type { DamageMap } from 'ptcg-server';
import { findItemByTarget } from './removeDamagePromptModel';
import type { PokemonItem, PokemonRow } from './pokemonPromptRows';

/** Sum of damage counters placed on top of the prompt-open snapshot. */
export function computeNetDamagePlaced(rows: PokemonRow[], initialDamageMap: DamageMap[]): number {
  let sum = 0;
  for (const init of initialDamageMap) {
    const item = findItemByTarget(rows, init.target);
    if (item !== undefined && item.cardList.damage > init.damage) {
      sum += item.cardList.damage - init.damage;
    }
  }
  return sum;
}

export function computePutRemaining(totalDamage: number, placed: number): number {
  return totalDamage - placed;
}

/** Server expects deltas vs snapshot (same as Angular `buildDamageMap`). */
export function buildPutDamageResult(rows: PokemonRow[], initialDamageMap: DamageMap[]): DamageMap[] {
  const results: DamageMap[] = [];
  for (const row of rows) {
    for (const item of row.items) {
      const initial = initialDamageMap.find(
        (i) =>
          i.target.player === item.target.player &&
          i.target.slot === item.target.slot &&
          i.target.index === item.target.index,
      );
      if (initial !== undefined) {
        const damage = item.cardList.damage - initial.damage;
        if (damage > 0) {
          results.push({ target: { ...item.target }, damage });
        }
      }
    }
  }
  return results;
}

export function computePutAddRemoveDisabled(
  rows: PokemonRow[],
  selected: PokemonItem | undefined,
  initialDamageMap: DamageMap[],
  maxDamageMap: DamageMap[],
  totalToPlace: number,
  damageMultiple: number,
): { remove: boolean; add: boolean } {
  if (selected === undefined) {
    return { remove: true, add: true };
  }
  const target = selected.target;
  const cardList = selected.cardList;
  const placed = computeNetDamagePlaced(rows, initialDamageMap);
  const remaining = computePutRemaining(totalToPlace, placed);

  const damageMap = maxDamageMap.find(
    (d) =>
      d.target.player === target.player && d.target.slot === target.slot && d.target.index === target.index,
  );
  const allowedDamage = damageMap?.damage;

  const initial = initialDamageMap.find(
    (i) =>
      i.target.player === target.player &&
      i.target.slot === target.slot &&
      i.target.index === target.index,
  );
  const initialDamage = initial?.damage ?? 0;

  const isRemoveDisabled = cardList.damage <= initialDamage;
  const isAddDisabled =
    remaining < damageMultiple || (allowedDamage !== undefined && cardList.damage >= allowedDamage);

  return { remove: isRemoveDisabled, add: isAddDisabled };
}

export function computePutInvalid(remaining: number, allowPlacePartialDamage: boolean): boolean {
  return remaining > 0 && !allowPlacePartialDamage;
}
