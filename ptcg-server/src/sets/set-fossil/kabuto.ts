import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, SpecialCondition } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Kabuto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mysterious Fossil';
  public cardType: CardType = F;
  public hp: number = 30;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public powers = [{
    name: 'Kabuto Armor',
    powerType: PowerType.POKEMON_POWER,
    text: 'Whenever an attack (even your own) does damage to Kabuto (after applying Weakness and Resistance), that attack does half the damage to Kabuto (rounded down to the nearest 10). (Any other effects of attacks still happen.) This power stops working while Kabuto is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [
    {
      name: 'Scratch',
      cost: [C],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Kabuto';

  public fullName: string = 'Kabuto FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {

      if (effect.target.specialConditions.includes(SpecialCondition.PARALYZED)
        || effect.target.specialConditions.includes(SpecialCondition.ASLEEP)
        || effect.target.specialConditions.includes(SpecialCondition.CONFUSED)) {
        return state;
      }

      try {
        const stub = new PowerEffect(effect.player, {
          name: 'test',
          powerType: PowerType.POKEMON_POWER,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      // Half the damage and round down to nearest 10
      const halvedDamage = Math.floor(effect.damage / 2);
      effect.damage = Math.floor(halvedDamage / 10) * 10;

      return state;
    }
    return state;
  }
}