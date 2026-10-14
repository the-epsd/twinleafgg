import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  Player,
  StoreLike,
  State,
  StateUtils,
  GameError,
  GameMessage,
} from '../../../game';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Brandon extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '151';
  public name: string = 'Brandon';
  public fullName: string = 'Brandon SIT 151';
  public text: string =
    "You can use this card only when it is the last card in your hand. Draw a card for each Benched Pokémon (both yours and your opponent's). You may play only 1 Supporter card during your turn.";

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const otherCards = player.hand.cards.filter((c) => c !== this);
    if (otherCards.length !== 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if this is the last card in hand
      const otherCards = player.hand.cards.filter((c) => c !== this);
      if (otherCards.length !== 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Count benched Pokemon for both players
      const playerBenched = player.bench.filter((b) => b.cards.length > 0).length;
      const opponentBenched = opponent.bench.filter((b) => b.cards.length > 0).length;
      const totalBenched = playerBenched + opponentBenched;

      if (totalBenched > 0) {
        DRAW_CARDS(store, state, player, totalBenched);
      }
    }

    return state;
  }
}
