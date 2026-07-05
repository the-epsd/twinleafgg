import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Gossifleur extends PokemonCard {
  public regulationMark = 'D';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Call For Family',
      cost: [C],
      damage: 0,
      text: 'Search your deck for up to 3 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.',
    },
    {
      name: 'Razor Leaf',
      cost: [G],
      damage: 10,
      text: '',
    },
  ];

  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Gossifleur';
  public fullName: string = 'Gossifleur SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store,
        state,
        player,
        { stage: Stage.BASIC },
        { min: 0, max: 3 },
      );
    }

    return state;
  }
}
