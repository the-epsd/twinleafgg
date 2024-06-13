import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';

export class LuminousEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PAL';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '191';

  public name = 'Luminous Energy';

  public fullName = 'Luminous Energy PAL';

  public text =
    'As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time.' +
    '' +
    'If the Pokémon this card is attached to has any other Special Energy attached, this card provides [C] Energy instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const attachedTo = effect.source;
      const otherSpecialEnergy = attachedTo.cards.some(card => {
        return card instanceof EnergyCard 
          && card.energyType === EnergyType.SPECIAL
          && card !== this; 
      });

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (otherSpecialEnergy) {
        effect.energyMap.push({ card: this, provides: [ CardType.COLORLESS ] });
      } else {
        effect.energyMap.push({ card: this, provides: [ CardType.ANY ] });
      }
      return state;
    }
    return state;
  }
}