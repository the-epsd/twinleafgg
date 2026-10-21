import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BONUS } from '../../../game/store/prefabs/attack-effects';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class MegaHeatranex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType[] = [M];
  public hp: number = 300;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'High Density Armor',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP, it takes 60 less damage from the attacks of your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Gigantic Press',
    cost: [M, M, M],
    damage: 140,
    text: 'During your next turn, this Pokémon\'s Gigantic Press attack does 140 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M-P';
  public setNumber: string = '169';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Heatran ex';
  public fullName: string = 'Mega Heatran ex M-P';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // High Density Armor
    if (effect instanceof DealDamageEffect && effect.target.getPokemonCard() === this) {
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }

      if (effect.target.damage === 0) {
        effect.damage = Math.max(0, effect.damage - 60);
      }
    }

    // Gigantic Press
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 140,
    });

    return state;
  }
}
