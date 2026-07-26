import { Effect } from '../../../game/store/effects/effect';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../../game/store/card/card-types';
import { StateUtils } from '../../../game/store/state-utils';
import { UseStadiumEffect } from '../../../game/store/effects/game-effects';
import { HANDLE_ABILITY_LOCK } from '../../../game/store/prefabs/ability-lock';

export class PowerPlant extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'UNB';
  public name: string = 'Power Plant';
  public fullName: string = 'Power Plant UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '183';

  public text: string =
    'Pokémon-GX and Pokémon-EX in play (both yours and your opponent\'s) have no Abilities.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    HANDLE_ABILITY_LOCK(effect, ({ card }) => {
      if (StateUtils.getStadiumCard(state) !== this) {
        return false;
      }
      const isEXorGX = card.tags.includes(CardTag.POKEMON_GX) || card.tags.includes(CardTag.POKEMON_EX);
      if (!isEXorGX) {
        return false;
      }
      return StateUtils.findPokemonSlot(state, card) !== undefined;
    }, {
      allowUseFromHand: true,
      allowUseFromDiscard: true,
      error: GameMessage.BLOCKED_BY_EFFECT,
    });

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
