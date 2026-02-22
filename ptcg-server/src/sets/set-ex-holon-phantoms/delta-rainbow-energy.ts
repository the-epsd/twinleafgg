import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';


export class DeltaRainbowEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'HP';
  public name = 'δ Rainbow Energy';
  public fullName = 'Delta Rainbow Energy HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';

  public text =
    'δ Rainbow Energy provides [C] Energy. While attached to a Pokémon that has δ on its card, δ Rainbow Energy provides every type of Energy but provides only 1 Energy at a time. (Has no effect other than providing Energy.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect
      && effect.source.cards.includes(this)
      && effect.source.getPokemonCard()?.tags.includes(CardTag.DELTA_SPECIES)) {
      effect.energyMap.push({ card: this, provides: [CardType.ANY] });
    }
    return state;
  }

}
