import { PokemonCard, StateUtils } from '../../game';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class CounterEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'CIN';

  public name = 'Counter Energy';

  public fullName = 'Counter Energy CIN';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '100';

  public text =
    'This card provides [C] Energy. If you have more Prize cards remaining than your opponent, and if this card is attached to a Pokémon that isn\'t a Pokémon-GX or Pokémon-EX, this card provides every type of Energy but provides only 2 Energy at a time.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const attachedTo = effect.source;

      const attachedToExOrGx = attachedTo.cards.some(card => {
        return card instanceof PokemonCard && (card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_GX));
      });

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (!!attachedTo.getPokemonCard() && player.getPrizeLeft() > opponent.getPrizeLeft() && !attachedToExOrGx) {
        effect.energyMap.push({ card: this, provides: [CardType.ANY, CardType.ANY] });
      } else {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      }
    }

    return state;
  }

}
