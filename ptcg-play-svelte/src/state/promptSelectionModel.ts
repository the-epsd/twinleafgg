import type { AttachAssignment } from '../lib/game/preview';
import type { CardTarget, CardView } from '../lib/game/types';
import { sameTarget } from '../lib/game/targets';

type IndexedCardView = CardView & {
  index?: number;
};

type AttachPromptOptions = {
  differentTargets?: unknown;
  sameTarget?: unknown;
};

export function sameAttachAssignments(left: AttachAssignment[], right: AttachAssignment[]) {
  return left.length === right.length
    && left.every((assignment, index) =>
      assignment.energyIndex === right[index].energyIndex && sameTarget(assignment.target, right[index].target),
    );
}

export function pruneAttachAssignments(
  assignments: AttachAssignment[],
  cards: IndexedCardView[],
  targets: CardTarget[],
  maxAssignments: number,
): AttachAssignment[] {
  return assignments.filter((assignment) =>
    cards.some((card, index) => (card.index ?? index) === assignment.energyIndex)
      && targets.some((target) => sameTarget(target, assignment.target)),
  ).slice(0, maxAssignments);
}

export function isAttachEnergyAvailable(energyIndex: number, blockedIndexes: number[], assignments: AttachAssignment[]) {
  return !blockedIndexes.includes(energyIndex) && !assignments.some((assignment) => assignment.energyIndex === energyIndex);
}

export function canAssignAttachTarget(
  target: CardTarget,
  energyIndex: number | null,
  assignments: AttachAssignment[],
  targets: CardTarget[],
  maxAssignments: number,
  options: AttachPromptOptions,
  isEnergyAvailable: (energyIndex: number) => boolean,
) {
  if (energyIndex === null || !isEnergyAvailable(energyIndex)) {
    return false;
  }
  if (maxAssignments > 1 && assignments.length >= maxAssignments) {
    return false;
  }
  if (options.differentTargets && assignments.some((assignment) => sameTarget(assignment.target, target))) {
    return false;
  }
  if (options.sameTarget && assignments.length > 0 && !sameTarget(assignments[0].target, target)) {
    return false;
  }
  return targets.some((item) => sameTarget(item, target));
}

export function toggleBoardTarget(selectedTargets: CardTarget[], target: CardTarget, maxSelections: number) {
  return selectedTargets.some((item) => sameTarget(item, target))
    ? selectedTargets.filter((item) => !sameTarget(item, target))
    : selectedTargets.length < maxSelections
      ? [...selectedTargets, target]
      : selectedTargets;
}

export type DamagePlacement = {
  target: CardTarget;
  damage: number;
};

export function totalPlacedDamage(placements: DamagePlacement[]) {
  return placements.reduce((sum, placement) => sum + placement.damage, 0);
}

export function damageForTarget(placements: DamagePlacement[], target: CardTarget) {
  return placements.find((placement) => sameTarget(placement.target, target))?.damage ?? 0;
}

export function sameDamagePlacements(left: DamagePlacement[], right: DamagePlacement[]) {
  return left.length === right.length
    && left.every((placement, index) =>
      placement.damage === right[index].damage && sameTarget(placement.target, right[index].target),
    );
}

export function maxDamageForTarget(maxAllowedDamage: DamagePlacement[], target: CardTarget) {
  return maxAllowedDamage.find((placement) => sameTarget(placement.target, target))?.damage ?? Infinity;
}

export function addDamagePlacement(
  placements: DamagePlacement[],
  target: CardTarget,
  amount: number,
  requiredDamage: number,
  maxTargetDamage = Infinity,
) {
  if (amount <= 0 || totalPlacedDamage(placements) + amount > requiredDamage) {
    return placements;
  }

  const currentDamage = damageForTarget(placements, target);
  if (currentDamage + amount > maxTargetDamage) {
    return placements;
  }

  if (currentDamage === 0) {
    return [...placements, { target, damage: amount }];
  }

  return placements.map((placement) =>
    sameTarget(placement.target, target)
      ? { ...placement, damage: placement.damage + amount }
      : placement,
  );
}

export function pruneDamagePlacements(placements: DamagePlacement[], targets: CardTarget[]) {
  return placements.filter((placement) => targets.some((target) => sameTarget(target, placement.target)));
}

export function damagePlacementsToResult(placements: DamagePlacement[]) {
  return placements
    .filter((placement) => placement.damage > 0)
    .map((placement) => ({ target: placement.target, damage: placement.damage }));
}

export function assignAttachTarget(
  assignments: AttachAssignment[],
  energyIndex: number,
  target: CardTarget,
  maxAssignments: number,
) {
  const withoutEnergy = assignments.filter((assignment) => assignment.energyIndex !== energyIndex);
  const nextAssignment = { energyIndex, target };
  return maxAssignments <= 1
    ? [nextAssignment]
    : [...withoutEnergy, nextAssignment].slice(0, maxAssignments);
}
