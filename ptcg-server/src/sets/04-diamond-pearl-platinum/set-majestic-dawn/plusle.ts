import { PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Plusle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +10 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Shuffle your deck afterward.'
  },
  {
    name: '– Boost',
    cost: [L, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If Minun is on your Bench, this attack does 20 damage plus 20 more damage.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Plusle';
  public fullName: string = 'Plusle MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call for Family
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { stage: Stage.BASIC });
    }

    // – Boost
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const hasMinunOnBench = effect.player.bench.some(b => b.getPokemonCard()?.name === 'Minun');
      if (hasMinunOnBench) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
