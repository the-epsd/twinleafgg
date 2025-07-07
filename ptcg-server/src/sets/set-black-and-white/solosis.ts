import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Solosis extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 30;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Cell Culture',
    cost: [P],
    damage: 0,
    text: 'Search your deck for Solosis and put it onto your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Rollout',
    cost: [P, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Solosis';
  public fullName: string = 'Solosis BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { name: 'Solosis' }, { min: 0, max: 1 });
    }

    return state;
  }
}