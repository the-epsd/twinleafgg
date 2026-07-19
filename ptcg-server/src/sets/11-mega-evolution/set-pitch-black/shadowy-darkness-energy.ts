import { StateUtils } from '../../../game';
import { CardType, EnergyType } from '../../../game/store/card/card-types';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import {
  CheckPokemonTypeEffect,
  CheckProvidedEnergyEffect,
} from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { EnergyEffect } from '../../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { GamePhase, State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

export class ShadowyDarknessEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'PBL';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name = 'Shadowy Darkness Energy';
  public fullName: string = 'Shadow Darkness Energy M5';

  public text =
    'As long as this card is attached to a Pokémon, it provides [D] Energy.\n\n' +
    "Prevent all damage done by your opponent's attacks to the Benched [D] Pokémon this card is attached to.";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      try {
        const energyEffect = new EnergyEffect(effect.player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      effect.energyMap.push({ card: this, provides: [CardType.DARK] });
      return state;
    }

    // Ref: set-temporal-forces/mist-energy.ts (IS_SPECIAL_ENERGY_BLOCKED / target owner),
    //      AGENTS.md (GamePhase.ATTACK for attack-sourced damage prevention)
    if (
      (effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
      state.phase === GamePhase.ATTACK &&
      effect.target.cards.includes(this)
    ) {
      const defenderOwner = StateUtils.findOwner(state, effect.target);
      if (effect.target === defenderOwner.active) {
        return state;
      }
      if (StateUtils.getOpponent(state, defenderOwner) !== effect.player) {
        return state;
      }

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, defenderOwner, this, effect.target)) {
        return state;
      }

      const checkType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkType);
      if (!checkType.cardTypes.includes(CardType.DARK)) {
        return state;
      }

      effect.damage = 0;
    }

    return state;
  }
}
