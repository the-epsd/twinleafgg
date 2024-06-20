import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AbstractAttackEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class WashWaterEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'VIV';

  public regulationMark = 'D';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '165';

  public name = 'Wash Water Energy';

  public fullName = 'Wash Water Energy VIV';

  public text =
    'As long as this card is attached to a Pokémon, it provides [W] Energy.' +
    '' +
    'Prevent all effects of attacks from your opponent\'s Pokémon done to the [W] Pokémon this card is attached to. (Existing effects are not removed. Damage is not an effect.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      effect.energyMap.push({ card: this, provides: [ CardType.WATER ] });
      
      return state;
    }
    
    // Prevent effects of attacks
    if (effect instanceof AbstractAttackEffect && effect.target?.cards?.includes(this)) {
      const sourceCard = effect.source.getPokemonCard();
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      
      if (sourceCard && sourceCard.cardType === CardType.WATER) {
    
        if (player.specialEnergyBlocked === true) {
          this.provides = [CardType.COLORLESS];
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
      