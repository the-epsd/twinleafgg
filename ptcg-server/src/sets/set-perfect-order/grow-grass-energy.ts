import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect, CheckHpEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class GrowGrassEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.GRASS];
  public energyType = EnergyType.SPECIAL;
  public regulationMark = 'J';
  public set: string = 'M3';
  public name = 'Grow [G] Energy';
  public fullName = 'Grow [G] Energy M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public text = 'This card provides [G] Energy while this card is attached to a Pokemon.\n\nThe [G] Pokemon this card is attached to gets +20 HP.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Provide [G] Energy
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [CardType.GRASS] });
    }

    // Add +20 HP to Grass Pokemon
    if (effect instanceof CheckHpEffect && effect.target?.cards?.includes(this)) {
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }

      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.GRASS)) {
        effect.hp += 20;
      }
    }

    return state;
  }
}
