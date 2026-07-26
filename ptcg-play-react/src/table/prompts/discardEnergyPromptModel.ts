import type { Card, CardTarget, DiscardEnergyOptions } from 'ptcg-server';
import type { FilterType } from 'ptcg-server';
import {
  buildBlockedCardsForSource,
  canSelectSource,
  filterEligibleEnergyCards,
} from './moveEnergyPromptModel';
import type { PokemonItem } from './pokemonPromptRows';
import { targetsEqual } from './removeDamagePromptModel';

export type DiscardEnergySelection = {
  from: CardTarget;
  card: Card;
};

export function hasDiscardEnergySelectionLimit(max: DiscardEnergyOptions['max']): max is number {
  return typeof max === 'number' && Number.isFinite(max);
}

export function computeDiscardEnergyInvalid(
  selections: DiscardEnergySelection[],
  options: Pick<DiscardEnergyOptions, 'min' | 'max'>,
): boolean {
  if (options.min === 0 && selections.length === 0) {
    return false;
  }
  if (selections.length < options.min) {
    return true;
  }
  if (hasDiscardEnergySelectionLimit(options.max) && selections.length > options.max) {
    return true;
  }
  return false;
}

export function eligibleEnergyCardsForSource(
  item: PokemonItem,
  filter: FilterType,
  blockedMap: { source: CardTarget; blocked: number[] }[],
  selections: DiscardEnergySelection[],
): Card[] {
  const blockedCards = buildBlockedCardsForSource(item, blockedMap);
  const eligible = filterEligibleEnergyCards(item, filter, blockedCards);
  const selectedFromSource = selections
    .filter((s) => targetsEqual(s.from, item.target))
    .map((s) => s.card);
  return eligible.filter((card) => !selectedFromSource.includes(card));
}

export function canSelectDiscardSource(
  item: PokemonItem,
  blockedFrom: CardTarget[],
  filter: FilterType,
  blockedMap: { source: CardTarget; blocked: number[] }[],
  selections: DiscardEnergySelection[],
): boolean {
  if (!canSelectSource(item, blockedFrom)) {
    return false;
  }
  return eligibleEnergyCardsForSource(item, filter, blockedMap, selections).length > 0;
}

export function toggleDiscardEnergySelection(
  selections: DiscardEnergySelection[],
  from: CardTarget,
  card: Card,
  max: DiscardEnergyOptions['max'],
): DiscardEnergySelection[] {
  const existingIdx = selections.findIndex(
    (s) => s.card === card && targetsEqual(s.from, from),
  );
  if (existingIdx >= 0) {
    return selections.filter((_, i) => i !== existingIdx);
  }
  if (hasDiscardEnergySelectionLimit(max) && selections.length >= max) {
    return selections;
  }
  return [...selections, { from: { ...from }, card }];
}

export function removeDiscardEnergySelection(
  selections: DiscardEnergySelection[],
  selection: DiscardEnergySelection,
): DiscardEnergySelection[] {
  return selections.filter(
    (s) => !(s.card === selection.card && targetsEqual(s.from, selection.from)),
  );
}

export function buildDiscardEnergyResolvePayload(
  selections: DiscardEnergySelection[],
  indexMap: Map<Card, number>,
): { from: CardTarget; index: number }[] {
  return selections.map((selection) => {
    const index = indexMap.get(selection.card);
    if (index === undefined) {
      throw new Error('Missing original card index for discard energy selection');
    }
    return { from: selection.from, index };
  });
}
