import { describe, expect, it } from 'vitest';
import { benchSlotsFor, previewAttachEnergySlot, previewSlot } from './preview';
import { SlotType, targetFor, type CardView, type PlayerView, type PokemonSlotView, type PromptView } from './types';

const pokemon: CardView = { name: 'Dreepy', fullName: 'Dreepy TWM', hp: 70 };
const energy: CardView & { index: number } = { index: 7, name: 'Psychic Energy', fullName: 'Psychic Energy SVE' };

describe('preview helpers', () => {
  it('decorates an empty slot with a pending setup Pokemon', () => {
    const empty = slot(0, 'active', 0, true);
    expect(previewSlot(empty, pokemon)).toMatchObject({
      empty: false,
      pokemon,
      cards: [pokemon],
      damage: 0,
      hp: 0,
      energy: [],
      tools: [],
      specialConditions: [],
    });
  });

  it('returns occupied bench slots plus setup previews for empty slots', () => {
    const player = playerView();
    const prompt = promptView();
    const result = benchSlotsFor(player, prompt, [0]);

    expect(result.map((item) => item.empty)).toEqual([false, false]);
    expect(result[1].pokemon).toEqual(pokemon);
    expect(result[1].index).toBe(1);
  });

  it('adds pending attach-energy cards to matching slots', () => {
    const targetSlot = slot(0, 'bench', 0, false);
    const result = previewAttachEnergySlot(
      targetSlot,
      promptView(),
      [{ energyIndex: 7, target: targetFor(0, 0, SlotType.BENCH, 0) }],
      [energy],
    );

    expect(result.energy).toHaveLength(1);
    expect(result.energy[0]).toMatchObject({ name: 'Psychic Energy', pendingAttach: true });
  });
});

function playerView(): PlayerView {
  return {
    index: 0,
    id: 1,
    name: 'Player 1',
    hand: [pokemon],
    deckCount: 0,
    discard: [],
    lostZone: [],
    stadium: [],
    playZone: [],
    prizesLeft: 6,
    active: slot(0, 'active', 0, false),
    bench: [slot(0, 'bench', 0, false), slot(0, 'bench', 1, true)],
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
    hp: empty ? 0 : 70,
    retreat: [],
    energy: [],
    tools: [],
    specialConditions: [],
  };
}

function promptView(): PromptView {
  return {
    id: 1,
    className: 'ChooseCardsPrompt',
    type: 'Choose cards',
    playerId: 1,
    playerIndex: 0,
    supported: true,
    resultSchema: 'unknown',
    fields: {},
  };
}
