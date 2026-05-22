import { describe, expect, it } from 'vitest';
import { addDamagePlacement, damageForTarget, damagePlacementsToResult, type DamagePlacement } from '../../../state/promptSelectionModel';
import { sameTarget } from '../targets';
import { SlotType, targetFor, type CardTarget, type GameView, type PlayerView, type PokemonSlotView, type PromptView } from '../types';
import { createChoosePokemonStrategy } from './choosePokemonStrategy';
import { createDamageTransferStrategy } from './damageTransferStrategy';
import { createPutDamageStrategy } from './putDamageStrategy';

const pokemon = { name: 'Ralts', fullName: 'Ralts SIT' };

describe('board interaction strategies', () => {
  it('places damage and resolves the existing damage result shape', () => {
    const game = gameView();
    const prompt = promptView('PutDamagePrompt', { damage: 20, options: { damageMultiple: 10 } });
    const store = new DamageStore();
    const resolved: unknown[] = [];
    const strategy = createPutDamageStrategy({ game, prompt, store, resolve: (value) => resolved.push(value) });
    const target = targetFor(0, 0, SlotType.ACTIVE);

    expect(strategy.isEligible(target)).toBe(true);
    strategy.activate(target);
    strategy.activate(target);

    expect(strategy.deltaFor(target)).toBe(20);
    expect(strategy.canConfirm).toBe(true);

    strategy.confirm();
    expect(resolved).toEqual([[{ target, damage: 20 }]]);
  });

  it('resolves single-target ChoosePokemonPrompt selections immediately', () => {
    const game = gameView();
    const prompt = promptView('ChoosePokemonPrompt', { options: { max: 1 } });
    const store = new BoardTargetStore();
    const resolved: unknown[] = [];
    const strategy = createChoosePokemonStrategy({ game, prompt, store, resolve: (value) => resolved.push(value) });
    const target = targetFor(0, 1, SlotType.BENCH, 0);

    strategy.activate(target);

    expect(store.selectedBoardTargets).toEqual([]);
    expect(resolved).toEqual([[target]]);
  });

  it('tracks damage-transfer source, destination, and signed deltas', () => {
    const game = gameView();
    game.players[0].active.damage = 30;
    const prompt = promptView('MoveDamagePrompt', { options: { min: 1, max: 2, damageMultiple: 10, sameTarget: true } });
    const store = new TransferStore();
    const resolved: unknown[] = [];
    const strategy = createDamageTransferStrategy({ game, prompt, store, resolve: (value) => resolved.push(value) });
    const source = targetFor(0, 0, SlotType.ACTIVE);
    const destination = targetFor(0, 1, SlotType.BENCH, 0);

    expect(strategy.isEligible(source)).toBe(true);
    strategy.activate(source);
    strategy.activate(destination);
    strategy.activate(destination);

    expect(strategy.deltaFor(source)).toBe(-20);
    expect(strategy.deltaFor(destination)).toBe(20);
    expect(strategy.canConfirm).toBe(true);

    strategy.confirm();
    expect(resolved).toEqual([[
      { from: source, to: destination },
      { from: source, to: destination },
    ]]);
    expect(store.counterCount).toBe(0);
  });
});

class DamageStore {
  damagePlacements: DamagePlacement[] = [];

  placeDamage(target: CardTarget, amount: number, requiredDamage: number, maxAllowedDamage: DamagePlacement[]) {
    const maxForTarget = maxAllowedDamage.find((placement) => sameTarget(placement.target, target))?.damage ?? Infinity;
    this.damagePlacements = addDamagePlacement(this.damagePlacements, target, amount, requiredDamage, maxForTarget);
  }

  resetDamagePlacements() {
    this.damagePlacements = [];
  }

  damageForTarget(target: CardTarget) {
    return damageForTarget(this.damagePlacements, target);
  }

  damageResult() {
    return damagePlacementsToResult(this.damagePlacements);
  }
}

class BoardTargetStore {
  selectedBoardTargets: CardTarget[] = [];

  toggleBoardTarget(target: CardTarget, maxSelections: number) {
    this.selectedBoardTargets = this.selectedBoardTargets.some((item) => sameTarget(item, target))
      ? this.selectedBoardTargets.filter((item) => !sameTarget(item, target))
      : this.selectedBoardTargets.length < maxSelections
        ? [...this.selectedBoardTargets, target]
        : this.selectedBoardTargets;
  }

  resetBoardTargets() {
    this.selectedBoardTargets = [];
  }
}

class TransferStore {
  source: CardTarget | null = null;
  pairs: Array<{ from: CardTarget; to: CardTarget }> = [];

  get destination() {
    return this.pairs[0]?.to ?? null;
  }

  get counterCount() {
    return this.pairs.length;
  }

  selectSource(target: CardTarget) {
    this.source = target;
  }

  addCounter(destination: CardTarget, maxCounters: number) {
    if (!this.source || this.pairs.length >= maxCounters) {
      return;
    }
    this.pairs = [...this.pairs, { from: this.source, to: destination }];
  }

  reset() {
    this.source = null;
    this.pairs = [];
  }

  isSource(target: CardTarget) {
    return !!this.source && sameTarget(this.source, target);
  }

  isDestination(target: CardTarget) {
    return !!this.destination && sameTarget(this.destination, target);
  }

  result() {
    return [...this.pairs];
  }
}

function gameView(): GameView {
  return {
    ready: true,
    phase: 2,
    phaseLabel: 'Player turn',
    turn: 1,
    activePlayerIndex: 0,
    players: [
      player(0, 'Player 1', [slot(0, 'bench', 0, false)]),
      player(1, 'Player 2', [slot(1, 'bench', 0, false)]),
    ],
    prompts: [],
    logs: [],
    events: [],
  };
}

function player(index: number, name: string, bench: PokemonSlotView[]): PlayerView {
  return {
    index,
    id: index + 1,
    name,
    hand: [],
    deckCount: 0,
    discard: [],
    lostZone: [],
    stadium: [],
    playZone: [],
    prizesLeft: 6,
    active: slot(index, 'active', 0, false),
    bench,
    playableCardIds: [],
  };
}

function slot(ownerIndex: number, kind: 'active' | 'bench', index: number, empty: boolean): PokemonSlotView {
  return {
    ownerIndex,
    slot: kind,
    index,
    target: targetFor(0, ownerIndex, kind === 'active' ? SlotType.ACTIVE : SlotType.BENCH, index),
    empty,
    pokemon: empty ? undefined : pokemon,
    cards: empty ? [] : [pokemon],
    damage: 0,
    hp: empty ? 0 : 60,
    retreat: [],
    energy: [],
    tools: [],
    specialConditions: [],
  };
}

function promptView(className: string, fields: Record<string, unknown> = {}): PromptView {
  return {
    id: 1,
    className,
    type: className,
    playerId: 1,
    playerIndex: 0,
    supported: true,
    resultSchema: 'unknown',
    fields,
  };
}
