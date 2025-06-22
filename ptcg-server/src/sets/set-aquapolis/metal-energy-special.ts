import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class MetalEnergySpecial extends EnergyCard {
  public provides: CardType[] = [CardType.METAL];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'AQ';
  public name = 'Metal Energy';
  public fullName = 'Metal Energy AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '143';
  public text = 'Damage done to the Pokémon Metal Energy is attached to is reduced by 10 (after applying Weakness and Resistance). If the Pokémon Metal Energy is attached to isn\'t [M], whenever it damages a Pokémon, reduce that damage by 10 (before applying Weakness and Resistance). Metal Energy provides [M] Energy. (Doesn\'t count as a basic Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // reduce damage if this mon isn't metal
    if (effect instanceof PutDamageEffect) {
      if (effect.source.cards.includes(this)) {
        const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
        store.reduceEffect(state, checkPokemonType);
        if (!checkPokemonType.cardTypes.includes(CardType.METAL)) {
          effect.damage -= 10;
        }
      }
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      effect.damage -= 10;
    }

    return state;
  }

}
