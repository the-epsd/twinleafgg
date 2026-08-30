import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../../game';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { NEXT_TURN_ATTACK_BONUS } from '../../../game/store/prefabs/attack-effects';

export class Gigalith extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Boldore';
  public cardType: CardType[] = [F];
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'High Density Armor',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP, any damage done to this Pokémon by an opponent\'s attack is reduced by 50 (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Overdrive Smash',
      cost: [F, F, F, C],
      damage: 60,
      damageCalculation: '+',
      text: 'During your next turn, this Pokémon\'s Overdrive Smash attack does 40 more damage (before applying Weakness and Resistance).'
    }
  ];

  public set: string = 'PHF';
  public setNumber: string = '50';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gigalith';
  public fullName: string = 'Gigalith PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // High Density Armor
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }

      // Check if this Pokemon has full HP
      if (effect.target.damage === 0) {
        effect.damage = Math.max(0, effect.damage - 50);
      }
    }

    // Overdrive Smash
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 40,
    });

    return state;
  }
}
