import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';

export class Simipour extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Panpour';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Scald',
      cost: [W],
      damage: 20,
      text: 'The Defending Pokemon is now Burned.'
    },
    {
      name: 'Fury Swipes',
      cost: [C, C, C],
      damage: 40,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 40 damage times the number of heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Simipour';
  public fullName: string = 'Simipour BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 40 * heads;
      });
    }
    return state;
  }
}
