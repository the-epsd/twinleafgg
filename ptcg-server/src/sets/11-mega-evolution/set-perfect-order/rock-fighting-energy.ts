import { CardType, EnergyType } from '../../../game/store/card/card-types';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import {
  CheckProvidedEnergyEffect
} from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { IS_ATTACK_EFFECT_FROM_OPPONENTS_POKEMON, IS_SPECIAL_ENERGY_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { StateUtils } from '../../../game/store/state-utils';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

export class RockFightingEnergy extends EnergyCard {
  public provides: CardType[] = [];
  public energyType = EnergyType.SPECIAL;
  public regulationMark = 'J';
  public set: string = 'POR';
  public name = 'Rocky Fighting Energy';
  public fullName = 'Rock Fighting Energy M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public text = `As long as this card is attached to a Pokémon, it provides [F] Energy.

Prevent all effects of attacks used by your opponent\'s Pokémon done to the [F] Pokémon this card is attached to. (Existing effects are not removed. Damage is not an effect.)`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Provide energy when attached to Fighting Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [CardType.FIGHTING] });
    }

    // Prevent effects of attacks
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard()?.cardType === CardType.FIGHTING) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.getOpponent(state, targetOwner);
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, opponent, this, effect.target)) {
        return state;
      }

      if (!IS_ATTACK_EFFECT_FROM_OPPONENTS_POKEMON(state, effect)) {
        return state;
      }

      if (effect.source.getPokemonCard()) {
        // Allow Weakness & Resistance
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        if (effect instanceof DealDamageEffect) {
          return state;
        }
        effect.preventDefault = true;
      }
    }

    return state;
  }
}