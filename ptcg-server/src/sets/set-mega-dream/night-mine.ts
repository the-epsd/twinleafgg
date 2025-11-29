import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType, CardTag } from '../../game/store/card/card-types';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';

export class NightMine extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '188';
  public name: string = 'Night Mine';
  public fullName: string = 'Night Mine M2a';
  public text: string = 'Attacks used by Tera Pokémon in play cost [C] more.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckAttackCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard && pokemonCard.tags.includes(CardTag.POKEMON_TERA)) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index > -1) {
          effect.cost.splice(index, 0, CardType.COLORLESS);
        } else {
          effect.cost.push(CardType.COLORLESS);
        }
        return state;
      }
      return state;
    }
    return state;
  }
}