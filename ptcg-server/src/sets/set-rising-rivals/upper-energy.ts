import { StoreLike, State, StateUtils } from '../../game';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

export class UpperEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'RR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name = 'Upper Energy';
  public fullName = 'Upper Energy RR';

  public text: string = 'Upper Energy provides [C] Energy. If you have more Prize cards left than your opponent and this card is attached to a Pokémon (excluding Pokémon LV.X), Upper Energy provides [C][C].';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Provide energy 
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this) && !effect.source.getPokemonCard()?.tags.includes(CardTag.POKEMON_LV_X)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const provides = player.getPrizeLeft() > opponent.getPrizeLeft() ? [CardType.COLORLESS, CardType.COLORLESS] : [CardType.COLORLESS];

      effect.energyMap.push({ card: this, provides });
      return state;
    }

    return state;
  }
}