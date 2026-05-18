import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';

export class Bombirdier extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Delivery Challenge',
    cost: [C, C],
    damage: 0,
    text: 'Flip 2 coins. If both are heads, search your deck for 1 Pokémon and put it onto your Bench. Then, shuffle your deck.',
  },
  {
    name: 'Speed Wing',
    cost: [C, C, C],
    damage: 100,
    text: '',
  }];

  public set: string = 'M5';
  public setNumber: string = '69';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bombirdier';
  public fullName: string = 'Bombirdier M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        if (results.length === 2 && results[0] && results[1]) {
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
            store, state, effect.player, {}, { min: 0, max: 1, allowCancel: false });
        }
      });
    }
    return state;
  }
}
