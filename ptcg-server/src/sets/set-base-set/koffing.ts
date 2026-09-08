import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { StateUtils } from '../../game';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Koffing extends PokemonCard {
  public name = 'Koffing';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '51';
  public set = 'BS';
  public fullName = 'Koffing BS';

  public stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks: Attack[] = [
    {
      name: 'Foul Gas',
      cost: [G, G],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned; if tails, it is now Confused.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
        if (heads) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        } else {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    return state;
  }

}
