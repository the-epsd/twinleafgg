import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class MagnetMetalEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.METAL];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'M4';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Magnet Metal Energy';
  public fullName: string = 'Magnet Metal Energy M4';
  public text: string = 'As long as this card is attached to a Pokemon, it provides [M] Energy. As long as this card is attached to a [M] Pokémon, that Pokemon has no Retreat Cost.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      try {
        const energyEffect = new EnergyEffect(effect.player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      effect.energyMap.push({ card: this, provides: [CardType.METAL] });
    }

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const hasThisEnergy = player.active.cards.includes(this) || player.active.energies.cards.includes(this);
      if (!hasThisEnergy) {
        return state;
      }
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, player.active)) {
        return state;
      }
      const checkType = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkType);
      if (checkType.cardTypes.includes(CardType.METAL)) {
        effect.cost = [];
      }
    }

    return state;
  }
}
