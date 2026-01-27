import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Whirlipede extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Venipede';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Venoshock',
      cost: [P],
      damage: 10,
      damageCalculation: '+',
      text: 'If the Defending Pokémon is Poisoned, this attack does 60 more damage.'
    },
    {
      name: 'Steamroller',
      cost: [C, C, C],
      damage: 40,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Whirlipede';
  public fullName: string = 'Whirlipede EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const isPoisoned = opponent.active.specialConditions.includes(SpecialCondition.POISONED);

      if (isPoisoned) {
        (effect as AttackEffect).damage += 60;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      (effect as AttackEffect).ignoreResistance = true;
    }

    return state;
  }
}
