import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { StateUtils } from '../../game';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Weedle extends PokemonCard {
  public name = 'Weedle';
  public cardImage: string = 'assets/cardback.png';
  public set = 'BS';
  public fullName = 'Weedle BS';
  public setNumber = '69';

  public cardType = G;
  public stage = Stage.BASIC;
  public hp = 40;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks: Attack[] = [
    {
      name: 'Poison Sting',
      cost: [G],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    return state;
  }

}
