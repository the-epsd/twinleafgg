import { State, StoreLike } from '../../game';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';

export class TwinEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS, CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'RCL';

  public name = 'Twin Energy';

  public fullName = 'Twin Energy RCL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '174';

  public text = 'As long as this card is attached to a Pokémon that isn\'t a Pokémon V or a Pokémon-GX, it provides [C][C] Energy.' + 
  '' + 
  'If this card is attached to a Pokémon V or a Pokémon-GX, it provides [C] Energy instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      
      if (effect.source.getPokemonCard()!.tags.includes(CardTag.POKEMON_GX) ||
          effect.source.getPokemonCard()!.tags.includes(CardTag.POKEMON_V) ||
          effect.source.getPokemonCard()!.tags.includes(CardTag.POKEMON_VSTAR) ||
          effect.source.getPokemonCard()!.tags.includes(CardTag.POKEMON_VMAX)) {
        return state;
      }

      this.provides = [ CardType.COLORLESS, CardType.COLORLESS ]; 
    }
    return state;
  }
}
