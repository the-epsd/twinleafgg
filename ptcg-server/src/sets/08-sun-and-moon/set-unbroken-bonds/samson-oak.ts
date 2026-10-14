import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Player, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class SamsonOak extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '185';
  public name: string = 'Samson Oak';
  public fullName: string = 'Samson Oak UNB';
  public text: string =
    'Draw 2 cards. If both Active Pokémon are the same type, draw 2 more cards. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      DRAW_CARDS(store, state, player, 2);

      // Check if both Active Pokemon are the same type
      const checkPlayerType = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPlayerType);

      const checkOpponentType = new CheckPokemonTypeEffect(opponent.active);
      store.reduceEffect(state, checkOpponentType);

      const sameType = checkPlayerType.cardTypes.some((t) => checkOpponentType.cardTypes.includes(t));
      if (sameType) {
        DRAW_CARDS(store, state, player, 2);
      }
    }

    return state;
  }
}
