import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { HealEffect } from '../../game/store/effects/game-effects';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';

export class RegenerativeEnergy extends EnergyCard {

  public regulationMark = 'F';

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '168';

  public name = 'Regenerative Energy';

  public fullName = 'Regenerative Energy SIT';

  public text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
    '' +
    'Whenever you play a Pokémon from your hand to evolve the Pokémon V this card is attached to, heal 100 damage from that Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    // Provide energy when attached to Single Strike Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const pokemon = effect.source;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (pokemon.getPokemonCard()?.tags.includes(CardTag.POKEMON_V)) {

        const healEffect = new HealEffect(player, pokemon, 100);
        store.reduceEffect(state, healEffect);

      }
      return state;
    }
    return state;
  }
}

    