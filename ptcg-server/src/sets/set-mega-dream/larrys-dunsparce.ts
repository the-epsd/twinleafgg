import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class LarrysDunsparce extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.LARRYS];
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [];

  public attacks = [{
    name: '',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Larry\'s Dunsparce';
  public fullName: string = 'Larry\'s Dunsparce M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result && effect instanceof AttackEffect) {
          effect.damage += 20;
        }
      });
    }
    return state;
  }
}


