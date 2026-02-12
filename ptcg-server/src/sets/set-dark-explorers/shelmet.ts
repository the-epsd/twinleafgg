import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';


export class Shelmet extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 60;

  public weakness = [{ type: R }];

  public retreat = [C, C, C];

  public attacks = [{
    name: 'Body Slam',
    cost: [G, G],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'DEX';

  public name: string = 'Shelmet';

  public fullName: string = 'Shelmet DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }
    return state;
  }

}
