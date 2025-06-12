import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';


export class MultiEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name = 'Multi Energy';
  public fullName = 'Multi Energy SS';

  public text =
    'Attach Multi Energy to 1 of your Pokémon. While in play, Multi Energy provides every type of Energy but provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) Multi energy provides [C] Energy when attached to a Pokémon that already has Special Energy cards attached to it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const attachedTo = effect.source;
      const otherSpecialEnergy = attachedTo.cards.some(card => {
        return card instanceof EnergyCard
          && card.energyType === EnergyType.SPECIAL
          && card !== this;
      });

      if (otherSpecialEnergy) {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      } else {
        effect.energyMap.push({ card: this, provides: [CardType.ANY] });
      }
      return state;
    }
    return state;
  }
}