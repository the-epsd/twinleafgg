import { StateUtils } from '../../game';
import { CardTag, CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ReversalEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PAL';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '192';

  public name = 'Reversal Energy';

  public fullName = 'Reversal Energy PAL';

  public text =
    'As long as this card is attached to a Pokémon, it provides C Energy.' +
    '' +
    'If you have more Prize cards remaining than your opponent, and if this card is attached to an Evolution Pokémon that doesn\'t have a Rule Box (Pokémon ex, Pokémon V, etc. have Rule Boxes), this card provides every type of Energy but provides only 3 Energy at a time.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const attachedTo = effect.source.getPokemonCard();

      const isValidPokemon = attachedTo instanceof PokemonCard
        && attachedTo.stage !== Stage.BASIC
        && attachedTo.stage !== Stage.RESTORED
        && !attachedTo.cardTag.includes(CardTag.POKEMON_V
          || CardTag.POKEMON_ex
          || CardTag.POKEMON_VSTAR
          || CardTag.POKEMON_VMAX
          || CardTag.RADIANT);

      const provides = player.getPrizeLeft() > opponent.getPrizeLeft() && isValidPokemon
        ? [CardType.ANY, CardType.ANY, CardType.ANY]
        : [CardType.COLORLESS];

      effect.energyMap.push({ card: this, provides });
      return state;
    }
    return state;
  }
}