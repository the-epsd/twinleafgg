import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game';

export class Lileep extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Unidentified Fossil';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [G],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  },
  {
    name: 'Seed Bomb',
    cost: [G, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Lileep';
  public fullName: string = 'Lileep CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    return state;
  }
}