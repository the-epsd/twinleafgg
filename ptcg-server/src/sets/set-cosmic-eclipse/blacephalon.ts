import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GET_PLAYER_PRIZES, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';

export class Blacephalon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ULTRA_BEAST];
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Fireworks Bomb',
    cost: [P, C],
    damage: 0,
    text: 'Put 4 damage counters on your opponent\'s Pokemon in any way you like. If your opponent has exactly 3 Prize cards remaining, put 12 damage counters on them instead.'
  }];

  public set: string = 'CEC';
  public name: string = 'Blacephalon';
  public fullName: string = 'Blacephalon CEC';
  public setNumber: string = '104';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      let counters = 4;
      const prizes = GET_PLAYER_PRIZES(effect.opponent).length;
      if (prizes === 3) {
        counters = 12;
      }
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(counters, store, state, effect);
    }

    return state;
  }

}