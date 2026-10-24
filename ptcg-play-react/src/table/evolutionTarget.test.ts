import { describe, expect, it } from 'vitest';
import { Stage, SuperType, type PokemonCard } from 'ptcg-server';
import {
  extraPlayableEvolutionCardIds,
  getInPlayPokemonCard,
  isValidEvolutionTarget,
} from './evolutionTarget';

function pokemon(name: string, extras: Partial<PokemonCard> = {}): PokemonCard {
  return {
    superType: SuperType.POKEMON,
    name,
    evolvesFrom: '',
    evolvesTo: [],
    evolvesToStage: [],
    evolvesFromBase: [],
    ...extras,
  } as PokemonCard;
}

describe('getInPlayPokemonCard', () => {
  it('returns the top of the evolution stack, not the Basic at cards[0]', () => {
    const chikorita = pokemon('Chikorita', { stage: Stage.BASIC });
    const bayleef = pokemon('Bayleef', { stage: Stage.STAGE_1, evolvesFrom: 'Chikorita' });
    expect(
      getInPlayPokemonCard({
        cards: [chikorita, bayleef],
      })?.name,
    ).toBe('Bayleef');
  });

  it('uses the stack even if getPokemonCard() still returns the Basic', () => {
    const chikorita = pokemon('Chikorita', { stage: Stage.BASIC });
    const bayleef = pokemon('Bayleef', { stage: Stage.STAGE_1, evolvesFrom: 'Chikorita' });
    expect(
      getInPlayPokemonCard({
        cards: [chikorita, bayleef],
        getPokemonCard: () => chikorita,
      })?.name,
    ).toBe('Bayleef');
  });
});

describe('isValidEvolutionTarget', () => {
  it('matches Stage 2 onto the current Stage 1, not the underlying Basic', () => {
    const chikorita = pokemon('Chikorita', { stage: Stage.BASIC });
    const bayleef = pokemon('Bayleef', { stage: Stage.STAGE_1, evolvesFrom: 'Chikorita' });
    const meganium = pokemon('Meganium', { stage: Stage.STAGE_2, evolvesFrom: 'Bayleef' });

    expect(isValidEvolutionTarget(meganium, chikorita)).toBe(false);
    expect(isValidEvolutionTarget(meganium, bayleef)).toBe(true);
    expect(isValidEvolutionTarget(bayleef, chikorita)).toBe(true);
  });

  it('matches name variants such as Eevee ex', () => {
    const eeveeEx = pokemon('Eevee ex', { stage: Stage.BASIC });
    const vaporeon = pokemon('Vaporeon', { stage: Stage.STAGE_1, evolvesFrom: 'Eevee' });
    expect(isValidEvolutionTarget(vaporeon, eeveeEx)).toBe(true);
  });
});

describe('extraPlayableEvolutionCardIds', () => {
  it('includes Stage 2 when the Stage 1 host can evolve this turn', () => {
    const chikorita = pokemon('Chikorita', { stage: Stage.BASIC });
    const bayleef = pokemon('Bayleef', { stage: Stage.STAGE_1, evolvesFrom: 'Chikorita' });
    const meganium = pokemon('Meganium', { stage: Stage.STAGE_2, evolvesFrom: 'Bayleef', id: 42 });
    const ids = extraPlayableEvolutionCardIds({
      hand: { cards: [meganium] },
      active: { cards: [chikorita, bayleef], canEvolveThisTurn: true },
      bench: [],
    } as any);
    expect(ids).toContain(42);
  });

  it('does not include Stage 2 when matching only the Basic and the host cannot evolve this turn', () => {
    const chikorita = pokemon('Chikorita', { stage: Stage.BASIC });
    const meganium = pokemon('Meganium', { stage: Stage.STAGE_2, evolvesFrom: 'Bayleef', id: 42 });
    const ids = extraPlayableEvolutionCardIds({
      hand: { cards: [meganium] },
      active: { cards: [chikorita], canEvolveThisTurn: true },
      bench: [],
    } as any);
    expect(ids).toEqual([]);
  });
});
