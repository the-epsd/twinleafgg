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
