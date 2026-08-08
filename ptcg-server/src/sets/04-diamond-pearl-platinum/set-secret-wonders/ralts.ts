import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { ADD_CONFUSION_TO_PLAYER_ACTIVE, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Ralts extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Smack',
    cost: [P],
    damage: 10,
    text: ''
  }, {
    name: 'Confuse Ray',
    cost: [P],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'SW';
  public name: string = 'Ralts';
  public fullName: string = 'Ralts SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      });
    }

    return state;
  }

}