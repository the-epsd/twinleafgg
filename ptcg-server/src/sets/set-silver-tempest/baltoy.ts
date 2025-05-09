import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Baltoy extends PokemonCard {

  public regulationMark = 'F';

  public stage = Stage.BASIC;

  public cardType = F;

  public hp = 50;

  public weakness = [{ type: G }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Find a Friend',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Slap',
      cost: [F],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Baltoy';
  public fullName: string = 'Baltoy SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this))
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 0, max: 1 });
    return state;
  }
}