import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType, CardTag } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { PlayItemEffect, PlaySupporterEffect } from '../../game/store/effects/play-card-effects';

export class ThunderMountainPrismStar extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public tags = [CardTag.PRISM_STAR];

  public set: string = 'LOT';

  public name: string = 'Thunder Mountain Prism Star';

  public fullName: string = 'Thunder Mountain Prism Star LOT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '191';

  public text: string =
    'The attacks of [L] Pokémon (both yours and your opponent\'s) cost[L] less.' +
    'Whenever any player plays an Item or Supporter card from their hand, prevent all effects of that card done to this Stadium card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckAttackCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const index = effect.cost.indexOf(CardType.LIGHTNING);

      // No cost to reduce
      if (index === -1) {
        return state;
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.LIGHTNING)) {
        effect.cost.splice(index, 1);
      }

      return state;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    if (effect instanceof PlaySupporterEffect && StateUtils.getStadiumCard(state) === this) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof PlayItemEffect && StateUtils.getStadiumCard(state) === this) {
      effect.preventDefault = true;
      return state;
    }

    return state;
  }

}
