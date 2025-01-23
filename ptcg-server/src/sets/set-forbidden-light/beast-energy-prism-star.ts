import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';

export class BeastEnergy extends EnergyCard {

  public tags = [CardTag.PRISM_STAR];

  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'FLI';

  public setNumber: string = '117';
  
  public cardImage = 'assets/cardback.png';

  public name = 'Beast Energy';

  public fullName = 'Beast Energy FLI';

  public text =
    'This card provides [C] Energy. \n While this card is attached to an Ultra Beast, it provides every type of Energy but provides only 1 Energy at a time. The attacks of the Ultra Beast this card is attached to do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Provide energy when attached to Ultra Beast Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      if (effect.source.getPokemonCard()?.tags.includes(CardTag.ULTRA_BEAST)) {
        effect.energyMap.push({ card: this, provides: [CardType.ANY] });
      }
      // slapping the default (this provides colorless) when not on an ultra beast
      if (!effect.source.getPokemonCard()?.tags.includes(CardTag.ULTRA_BEAST)) {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      }
      return state;
    }

    // do the additional damage
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target !== opponent.active) {
        return state;
      }

      if (!effect.source.getPokemonCard()?.tags.includes(CardTag.ULTRA_BEAST)) {
        return state;
      }

      effect.damage += 30;
    }

    return state;
  }

}