import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Klink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Spinning Attack',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Gear Grind',
      cost: [M, C, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Klink';
  public fullName: string = 'Klink EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        (effect as AttackEffect).damage = 30 * heads;
      });
    }
    return state;
  }
}
