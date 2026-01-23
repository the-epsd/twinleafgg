import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Scolipede extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Whirlipede';
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Megahorn',
      cost: [P, C, C],
      damage: 70,
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
    {
      name: 'Venoshock',
      cost: [P, P, C, C],
      damage: 50,
      damageCalculation: '+',
      text: 'If the Defending Pokemon is Poisoned, this attack does 60 more damage.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Scolipede';
  public fullName: string = 'Scolipede BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          (effect as AttackEffect).damage = 0;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        (effect as AttackEffect).damage += 60;
      }
    }

    return state;
  }
}
