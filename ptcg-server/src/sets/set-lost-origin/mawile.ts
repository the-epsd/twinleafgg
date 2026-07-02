import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  BLOCK_RETREAT,
  DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class Mawile extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public attacks =
    [
      {
        name: 'Tempting Trap',
        cost: [CardType.COLORLESS],
        damage: 0,
        text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat. During your next turn, the Defending Pokémon takes 90 more damage from attacks (after applying Weakness and Resistance).'
      },
      {
        name: 'Bite',
        cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
        damage: 90,
        text: ''
      }
    ];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Mawile';

  public fullName: string = 'Mawile LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 90);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
