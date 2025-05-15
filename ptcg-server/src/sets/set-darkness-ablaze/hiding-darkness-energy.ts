import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HidingDarknessEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'DAA';

  public name = 'Hiding Darkness Energy';

  public fullName = 'Hiding Darkness Energy DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '175';

  public text =
    `As long as this card is attached to a Pokémon, it provides [D] Energy.
    
The [D] Pokémon this card is attached to has no Retreat Cost.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [CardType.DARK] });
      return state;
    }

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.player.active)) {
        return state;
      }

      const checkPokemonType = new CheckPokemonTypeEffect(effect.player.active);
      store.reduceEffect(state, checkPokemonType);
      if (!checkPokemonType.cardTypes.includes(CardType.DARK)) {
        return state;
      }

      effect.cost = [];
    }

    return state;
  }

}
