import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class NsCastle extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'SV9';
  public name: string = 'N\'s Castle';
  public fullName: string = 'N\'s Castle SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '97';

  public text: string = 'Each N’s Pokémon in play (both yours and your opponent’s) has no Retreat Cost.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && StateUtils.getStadiumCard(state) === this) {
      if (effect.player.active.getPokemonCard()?.tags.includes(CardTag.NS)){
        effect.cost = [  ];
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}
