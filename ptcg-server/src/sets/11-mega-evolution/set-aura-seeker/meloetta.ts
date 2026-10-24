import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Meloetta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Welcoming Song',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 3 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Perplex',
    cost: [P, C],
    damage: 30,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Meloetta';
  public fullName: string = 'Meloetta FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Welcoming Song
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store,
        state,
        effect.player,
        { stage: Stage.BASIC },
        { min: 0, max: 3 }
      );
    }

    // Perplex
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    return state;
  }
}
