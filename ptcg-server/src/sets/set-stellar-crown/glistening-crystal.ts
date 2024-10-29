import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class GlisteningCrystal extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public tags = [CardTag.ACE_SPEC];

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '142';

  public regulationMark = 'H';

  public name: string = 'Sparkling Crystal';

  public fullName: string = 'Glistening Crystal SV7';

  public text: string =
    'When the Tera Pokémon this card is attached to uses an attack, that attack costs 1 Energy less. (The Energy can be of any type.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.player.active.tool === this) {
      const pokemonCard = effect.player.active.getPokemonCard();
      if (pokemonCard && pokemonCard.tags.includes(CardTag.POKEMON_TERA)) {
        const checkEnergy = new CheckProvidedEnergyEffect(effect.player);
        store.reduceEffect(state, checkEnergy);

        const availableEnergy = checkEnergy.energyMap.flatMap(e => e.provides);

        effect.cost = effect.cost.filter(costType =>
          costType === CardType.NONE || availableEnergy.includes(costType as CardType));
      }
    }
    return state;
  }
}