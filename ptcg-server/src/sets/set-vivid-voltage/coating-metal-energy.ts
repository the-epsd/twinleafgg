import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AbstractAttackEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class CoatingMetalEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'VIV';

  public name = 'Coating Metal Energy';

  public fullName = 'Coating Metal Energy VIV';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '163';

  public text =
    'As long as this card is attached to a Pokémon, it provides [M] Energy.' +
    '' +
    'The [M] Pokémon this card is attached to has no Weakness.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      effect.energyMap.push({ card: this, provides: [ CardType.METAL ] });
      
      return state;
    }

    // Prevent effects of attacks
    if (effect instanceof AbstractAttackEffect && effect.target && effect.target.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.METAL)) {
    
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          effect.attackEffect.ignoreWeakness = true;
          return state; 
        }
        if (effect instanceof DealDamageEffect) {
          effect.attackEffect.ignoreWeakness = true;
          return state; 
        }
      }
    }

    return state;
  }

}
