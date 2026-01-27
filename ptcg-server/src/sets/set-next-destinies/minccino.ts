import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';

export class Minccino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Call for Family',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Basic Pokemon and put it onto your Bench. Shuffle your deck afterward.'
    },
    {
      name: 'Tail Smack',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '84';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Minccino';
  public fullName: string = 'Minccino NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call for Family - search for a Basic Pokemon and put onto bench
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store, state, player,
        { stage: Stage.BASIC },
        { min: 0, max: 1 }
      );
    }

    return state;
  }
}
