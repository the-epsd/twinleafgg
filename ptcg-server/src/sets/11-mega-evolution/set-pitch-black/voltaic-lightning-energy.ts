import { EnergyCard, CardType, EnergyType, StoreLike, State } from "../../../game";
import { DealDamageEffect } from "../../../game/store/effects/attack-effects";
import { CheckProvidedEnergyEffect, CheckPokemonTypeEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { EnergyEffect } from "../../../game/store/effects/play-card-effects";
import { IS_SPECIAL_ENERGY_BLOCKED } from "../../../game/store/prefabs/prefabs";

export class VoltaicLightningEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'PBL';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name = 'Voltaic [L] Energy';
  public fullName: string = 'Bolty [L] Energy M5';
  public text = `As long as this card is attached to a Pokémon, it provides [L] Energy.

Attacks used by the [L] Pokémon this card is attached to do 20 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      try {
        const energyEffect = new EnergyEffect(effect.player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      effect.energyMap.push({ card: this, provides: [CardType.LIGHTNING] });
      return state;
    }

    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.source)) {
        return state;
      }
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);
      if (!checkPokemonType.cardTypes.includes(CardType.LIGHTNING)) {
        return state;
      }
      if (effect.damage && effect.damage > 0 && effect.target === effect.opponent.active) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
