import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Luxio2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shinx';
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [
    {
      name: 'Quick Turn',
      cost: [L],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    },
    {
      name: 'Bite',
      cost: [C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '45';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Luxio';
  public fullName: string = 'Luxio NXD 45';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Quick Turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 20 * heads;
      });
    }
    return state;
  }
}
