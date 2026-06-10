import { CardTarget, HeadlessCommandRequest, PlayerType, SlotType } from '../engine';
import { Seat, SeatView } from '../types';

// Picks uniformly among plausible commands. Plausible, not legal: playCard
// targets are enumerated optimistically (active + every bench slot) and the
// engine rejects the illegal ones; the runner feeds rejections back via
// view.failedAttempts so they are not picked twice. Prompts are answered with
// the engine's default resolution.
export class RandomAgent implements Seat {
  constructor(
    public readonly name: string = 'random',
    private readonly rng: () => number = Math.random
  ) {}

  public act(view: SeatView): HeadlessCommandRequest {
    if (view.pendingPrompt) {
      return { type: 'resolvePrompt', payload: { id: view.pendingPrompt.id, useDefault: true } };
    }

    const failed = new Set(view.failedAttempts.map(attempt => JSON.stringify(attempt.command)));
    const candidates = this.buildCandidates(view).filter(command => !failed.has(JSON.stringify(command)));
    if (candidates.length === 0) {
      return { type: 'passTurn', payload: { player: view.seatIndex } };
    }
    return candidates[Math.floor(this.rng() * candidates.length)];
  }

  private buildCandidates(view: SeatView): HeadlessCommandRequest[] {
    const player = view.seatIndex;
    const candidates: HeadlessCommandRequest[] = [];

    const targets: CardTarget[] = [
      { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      ...view.me.bench.map((_, index) => ({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index }))
    ];
    for (const card of view.playableCards) {
      for (const target of targets) {
        candidates.push({ type: 'playCard', payload: { player, handIndex: card.handIndex, target } });
      }
    }

    const active = view.me.availableActions?.active;
    for (const attack of active?.attacks ?? []) {
      if (attack.legal) {
        candidates.push({ type: 'attack', payload: { player, attack: attack.name } });
      }
    }
    for (const ability of active?.abilities ?? []) {
      if (ability.legal) {
        candidates.push({
          type: 'useAbility',
          payload: { player, ability: ability.name, target: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 } }
        });
      }
    }
    if (active?.retreat.legal) {
      for (const to of active.retreat.targets) {
        candidates.push({ type: 'retreat', payload: { player, to } });
      }
    }
    for (const bench of view.me.availableActions?.bench ?? []) {
      for (const ability of bench.abilities) {
        if (ability.legal) {
          candidates.push({
            type: 'useAbility',
            payload: { player, ability: ability.name, target: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: bench.index } }
          });
        }
      }
    }

    if (view.me.stadium.length > 0 || view.opponent.stadium.length > 0) {
      candidates.push({ type: 'useStadium', payload: { player } });
    }

    candidates.push({ type: 'passTurn', payload: { player } });
    return candidates;
  }
}
