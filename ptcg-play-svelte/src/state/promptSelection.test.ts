import { describe, expect, it } from 'vitest';
import { SlotType, type CardTarget, type CardView } from '../lib/game/types';
import {
  addDamagePlacement,
  assignAttachTarget,
  canAssignAttachTarget,
  damagePlacementsToResult,
  damageForTarget,
  isAttachEnergyAvailable,
  pruneAttachAssignments,
  pruneDamagePlacements,
  sameAttachAssignments,
  totalPlacedDamage,
  toggleBoardTarget,
} from './promptSelectionModel';

const targetA: CardTarget = { player: 0, slot: SlotType.ACTIVE, index: 0 };
const targetB: CardTarget = { player: 0, slot: SlotType.BENCH, index: 1 };
const targetC: CardTarget = { player: 1, slot: SlotType.BENCH, index: 2 };
const cards: Array<CardView & { index?: number }> = [
  { index: 2, name: 'Fire Energy', fullName: 'Fire Energy' },
  { index: 5, name: 'Water Energy', fullName: 'Water Energy' },
];

describe('prompt selection model', () => {
  it('prunes attach assignments when cards or targets disappear', () => {
    const assignments = [
      { energyIndex: 2, target: targetA },
      { energyIndex: 5, target: targetC },
      { energyIndex: 9, target: targetB },
    ];

    const next = pruneAttachAssignments(assignments, cards, [targetA, targetB], 2);

    expect(next).toEqual([{ energyIndex: 2, target: targetA }]);
  });

  it('compares attach assignments by value', () => {
    expect(sameAttachAssignments(
      [{ energyIndex: 2, target: targetA }],
      [{ energyIndex: 2, target: { ...targetA } }],
    )).toBe(true);
    expect(sameAttachAssignments(
      [{ energyIndex: 2, target: targetA }],
      [{ energyIndex: 5, target: targetA }],
    )).toBe(false);
  });

  it('toggles board targets without exceeding the prompt max', () => {
    expect(toggleBoardTarget([], targetA, 2)).toEqual([targetA]);
    expect(toggleBoardTarget([targetA], targetA, 2)).toEqual([]);
    expect(toggleBoardTarget([targetA, targetB], targetC, 2)).toEqual([targetA, targetB]);
  });

  it('assigns attach targets by energy and respects max assignment count', () => {
    const first = assignAttachTarget([], 2, targetA, 2);
    const second = assignAttachTarget(first, 5, targetB, 2);
    const replaced = assignAttachTarget(second, 2, targetC, 2);
    const capped = assignAttachTarget(replaced, 9, targetA, 2);

    expect(second).toEqual([
      { energyIndex: 2, target: targetA },
      { energyIndex: 5, target: targetB },
    ]);
    expect(replaced).toEqual([
      { energyIndex: 5, target: targetB },
      { energyIndex: 2, target: targetC },
    ]);
    expect(capped).toEqual([
      { energyIndex: 5, target: targetB },
      { energyIndex: 2, target: targetC },
    ]);
  });

  it('blocks unavailable attach energies and invalid attach targets', () => {
    const assignments = [{ energyIndex: 2, target: targetA }];
    const available = (energyIndex: number) => isAttachEnergyAvailable(energyIndex, [7], assignments);

    expect(available(2)).toBe(false);
    expect(available(7)).toBe(false);
    expect(available(5)).toBe(true);
    expect(canAssignAttachTarget(targetB, 5, assignments, [targetA, targetB], 2, { differentTargets: true }, available)).toBe(true);
    expect(canAssignAttachTarget(targetA, 5, assignments, [targetA, targetB], 2, { differentTargets: true }, available)).toBe(false);
    expect(canAssignAttachTarget(targetC, 5, assignments, [targetA, targetB], 2, {}, available)).toBe(false);
  });

  it('places damage in fixed increments without exceeding prompt limits', () => {
    const first = addDamagePlacement([], targetB, 10, 60, 60);
    const second = addDamagePlacement(first, targetB, 10, 60, 60);
    const third = addDamagePlacement(second, targetC, 10, 60, 20);
    const cappedByTarget = addDamagePlacement(third, targetC, 20, 60, 20);
    const cappedByTotal = addDamagePlacement([
      { target: targetB, damage: 50 },
      { target: targetC, damage: 10 },
    ], targetB, 10, 60, 60);

    expect(second).toEqual([{ target: targetB, damage: 20 }]);
    expect(third).toEqual([
      { target: targetB, damage: 20 },
      { target: targetC, damage: 10 },
    ]);
    expect(cappedByTarget).toBe(third);
    expect(cappedByTotal).toEqual([
      { target: targetB, damage: 50 },
      { target: targetC, damage: 10 },
    ]);
    expect(totalPlacedDamage(third)).toBe(30);
    expect(damageForTarget(third, targetB)).toBe(20);
    expect(damagePlacementsToResult(third)).toEqual(third);
    expect(pruneDamagePlacements(third, [targetB])).toEqual([{ target: targetB, damage: 20 }]);
  });
});
