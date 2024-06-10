import { TrainerCard } from '../../game/store/card/trainer-card';
import {  EnergyType, TrainerType } from '../../game/store/card/card-types';
import { State, EnergyCard, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { KnockOutAttackEffect } from '../../game/store/effects/game-effects';

export class TempleofSinnoh extends TrainerCard {

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '155';
  
  public trainerType = TrainerType.STADIUM;

  public set = 'ASR';

  public name = 'Temple of Sinnoh';

  public fullName = 'Temple of Sinnoh ASR';

  public text = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide C Energy and have no other effect.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && StateUtils.getStadiumCard(state) === this) {
      // Check if the effect is an attack effect
      if (effect instanceof AbstractAttackEffect) {
        // Check if the attacking Pokémon has any Special Energy attached
        if (effect.source.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
          // Prevent the attack effect
          effect.preventDefault = true;
        }
      }

      // Check if the effect is an attach energy effect
      if (effect instanceof AttachEnergyEffect) {
        // Check if the energy being attached is a Special Energy
        if (effect.energyCard.energyType === EnergyType.SPECIAL) {
          // Prevent the attach energy effect
          const player = effect.player;
          player.specialEnergyBlocked = true;
        }
      }
    }

    // Check if the effect is an attach energy effect
    if (effect instanceof PutDamageEffect) {
      // Check if the energy being attached is a Special Energy
      if (effect.type.includes(EnergyType.SPECIAL.toString())) {
        // Prevent the attach energy effect
        const player = effect.player;
        player.specialEnergyBlocked = true;
      }
    }

    // Check if the effect is an attach energy effect
    if (effect instanceof KnockOutAttackEffect) {
      // Check if the energy being attached is a Special Energy
      if (effect.type.includes(EnergyType.SPECIAL.toString())) {
        // Prevent the attach energy effect
        const player = effect.player;
        player.specialEnergyBlocked = true;
      }
    }
  

    // Check if the effect is an attach energy effect
    if (effect instanceof CheckProvidedEnergyEffect) {
      // Check if the energy being provided is a Special Energy
      if (effect.type.includes(EnergyType.SPECIAL.toString())) {
        // Prevent the attach energy effect
        const player = effect.player;
        player.specialEnergyBlocked = true;
      }
    }

    return state;
  }
}
