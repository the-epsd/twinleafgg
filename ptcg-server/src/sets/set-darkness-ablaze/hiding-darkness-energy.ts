import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HidingDarknessEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'DAA';

  public name = 'Hiding Darkness Energy';

  public fullName = 'Hiding Darkness Energy DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '175';

  public text =
    'As long as this card is attached to a Pokémon, it provides [D] Energy.' +
    '' +
    'The [D] Pokémon this card is attached to has no Retreat Cost.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      effect.energyMap.push({ card: this, provides: [ CardType.DARK ] });
      
      return state;
    }

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;

      try {
        const toolEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      effect.cost = [];
    }

    return state;
  }

}
