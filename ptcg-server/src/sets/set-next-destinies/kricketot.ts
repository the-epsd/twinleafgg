import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Kricketot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Beat',
      cost: [G],
      damage: 10,
      text: ''
    },
    {
      name: 'Double Headbutt',
      cost: [G, G],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip 2 coins. This attack does 10 more damage for each heads.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kricketot';
  public fullName: string = 'Kricketot NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Headbutt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage += 10 * heads;
      });
    }
    return state;
  }
}
