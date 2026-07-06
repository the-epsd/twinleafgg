import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  BLOCK_RETREAT,
  DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Stunfisk extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Pouncing Trap',
    cost: [L],
    damage: 30,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat. During your next turn, the Defending Pokémon takes 100 more damage from attacks (after applying Weakness and Resistance).'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Stunfisk';
  public fullName: string = 'Stunfisk M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pouncing Trap
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 100);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
