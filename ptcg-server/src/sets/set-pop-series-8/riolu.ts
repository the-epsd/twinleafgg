import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Riolu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Inner Focus',
    powerType: PowerType.POKEBODY,
    text: 'Riolu can\'t be Paralyzed.'
  }];

  public attacks = [{
    name: 'Quick Attack',
    cost: [F],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage.'
  }];

  public set: string = 'P8';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Riolu';
  public fullName: string = 'Riolu P8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AddSpecialConditionsEffect && effect.specialConditions.includes(SpecialCondition.PARALYZED) && effect.target.getPokemonCard() === this) {
      effect.preventDefault = true;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    return state;
  }
}
