import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Braviary extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Rufflet';
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [
    {
      name: 'Slash',
      cost: [C],
      damage: 30,
      text: ''
    },
    {
      name: 'Fury Attack',
      cost: [C, C, C],
      damage: 50,
      damageCalculation: 'x' as 'x',
      text: 'Flip 3 coins. This attack does 50 damage times the number of heads.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '112';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Braviary';
  public fullName: string = 'Braviary DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 50 * heads;
      });
    }

    return state;
  }
}
