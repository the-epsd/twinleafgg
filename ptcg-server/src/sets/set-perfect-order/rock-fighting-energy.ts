import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import {
  CheckPokemonTypeEffect,
  CheckProvidedEnergyEffect
} from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class RockFightingEnergy extends EnergyCard {
  public provides: CardType[] = [];
  public energyType = EnergyType.SPECIAL;
  public regulationMark = 'J';
  public set: string = 'M3';
  public name = 'Rock Fighting Energy';
  public fullName = 'Rock Fighting Energy M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public text = `This card provides [F] Energy while this card is attached to a Pokémon.
  
  Prevent all effects of attacks used by your opponent\'s Pokémon done to the [F] Pokémon this card is attached to. (Existing effects are not removed. Damage is not an effect.)`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Provide energy when attached to Fighting Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.FIGHTING)) {
        effect.energyMap.push({ card: this, provides: [CardType.FIGHTING] });
      }
    }

    // Prevent effects of attacks
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard()?.cardType === CardType.FIGHTING) {

      const opponent = StateUtils.getOpponent(state, effect.player);
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, opponent, this, effect.target)) {
        return state;
      }

      const sourceCard = effect.source.getPokemonCard();

      if (sourceCard) {
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