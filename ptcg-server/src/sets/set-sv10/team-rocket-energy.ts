import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class TeamRocketEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public tags: CardTag[] = [CardTag.TEAM_ROCKET];

  public energyType = EnergyType.SPECIAL;

  public regulationMark = 'I';

  public set: string = 'SV10';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '98';

  public name = 'Team Rocket Energy';

  public fullName = 'Team Rocket Energy SV10';

  public text = `This card can only be attached to a Team Rocket\'s Pokémon. If this card is attached to anything other than a Team Rocket\'s Pokémon, discard this card.
  
  While this card is attached to a Pokémon, this card provides 2 in any combination of [P] and [D] Energy`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Check if the card is attached to a Team Rocket's Pokémon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const pokemonCard = effect.source.getPokemonCard();

      // Check if the Pokémon is a Team Rocket's Pokémon
      if (!this.isTeamRocketPokemon(pokemonCard)) {
        // If not, we should discard this card, but don't provide energy
        // Handling discard would be implemented elsewhere
        return state;
      }

      try {
        // Add the base EnergyEffect
        const energyEffect = new EnergyEffect(effect.player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      // This energy provides 2 energy in any combination of Psychic and Darkness
      // We'll provide both types and let the energy checking algorithm pick the best combination
      // The logic in StateUtils.checkEnoughEnergy will handle this appropriately
      effect.energyMap.push({
        card: this,
        provides: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.DARK, CardType.DARK]
      });
    }

    return state;
  }

  // Helper method to check if a Pokémon is a Team Rocket's Pokémon
  private isTeamRocketPokemon(pokemon: PokemonCard | undefined): boolean {
    if (!pokemon) return false;
    return pokemon.tags.includes(CardTag.TEAM_ROCKET);
  }
}
