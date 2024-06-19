import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';

export class SpeedLightningEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'RCL';

  public regulationMark = 'D';
  
  public name = 'Speed Lightning Energy';

  public fullName = 'Speed Lightning Energy RCL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '173';

  public text =
    'As long as this card is attached to a Pokémon, it provides [L] Energy. When you attach this card from your hand to a [L] Pokémon, draw 2 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      effect.energyMap.push({ card: this, provides: [ CardType.LIGHTNING ] });
    }
    
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;
      
      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (effect.target.getPokemonCard()?.cardType === CardType.LIGHTNING) {
        player.deck.moveTo(player.hand, 2);        
      }
    }
    return state;
  }

}
