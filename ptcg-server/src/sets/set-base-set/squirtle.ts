import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import {
  ADD_PARALYZED_TO_PLAYER_ACTIVE,
  AFTER_ATTACK,
  COIN_FLIP_PROMPT,
  PREVENT_DAMAGE,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class Squirtle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 40;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Bubble',
    cost: [W],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }, {
    name: 'Withdraw',
    cost: [W, C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Squirtle during your opponent\'s next turn. (Any other effects of attacks still happen.)'
  }];

  public set: string = 'BS';
  public name: string = 'Squirtle';
  public fullName: string = 'Squirtle BS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bubble
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    // Withdraw
    // Ref: set-astral-radiance/hisuian-growlithe.ts (Defensive Posture)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
