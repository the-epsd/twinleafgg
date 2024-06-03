import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class GlisteningCrystal extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public tags = [ CardTag.ACE_SPEC ];

  public set: string = 'SV7';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '94';

  public regulationMark = 'H';

  public name: string = 'Glistening Crystal';

  public fullName: string = 'Glistening Crystal SV7';

  public text: string =
    'Attacks of the Terastal Pokémon this card is attached to cost 1 Energy less of any type.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const attackCost = effect.attack.cost;

      if (player.active.tool?.cards.cards.includes(this)) {
        // Remove 1 of any energy type from the attack cost
        const energyIndex = attackCost.findIndex(c => c === CardType.COLORLESS || c === CardType.FIGHTING || c === CardType.PSYCHIC || c === CardType.LIGHTNING || c === CardType.FIRE || c === CardType.WATER || c === CardType.GRASS);

        if (energyIndex !== -1) {
          attackCost.splice(energyIndex, 1);
        }
      }
    }
    return state;
  }
}
