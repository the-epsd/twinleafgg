import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { HealEffect } from '../../game/store/effects/game-effects';

export class JumboIce extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'I';
  public set: string = 'PFL';
  public name: string = 'Jumbo Ice Cream';
  public fullName: string = 'Jumbo Ice M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public text: string = 'Heal 80 damage from your Active Pokémon that has 3 or more Energy attached.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const activePokemon = player.active.getPokemonCard();

      if (activePokemon) {
        // Check if the Pokemon has 3 or more Energy attached
        const checkEnergy = new CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkEnergy);

        if (checkEnergy.energyMap.length >= 3) {
          const healEffect = new HealEffect(player, player.active, 80);
          store.reduceEffect(state, healEffect);
        }
      }
    }

    return state;
  }
}
