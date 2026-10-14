import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, StateUtils } from '../../../game';
import { MOVE_CARDS, SHUFFLE_HAND_INTO_DECK_THEN_DRAW } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Copycat extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '127';
  public name: string = 'Copycat';
  public fullName: string = 'Copycat CES';
  public text: string =
    "Shuffle your hand into your deck. Then, draw a card for each card in your opponent's hand.";

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

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, player, {
        excludeCard: effect.trainerCard,
        sourceCard: this,
        drawCount: opponent.hand.cards.length,
      });
    }

    return state;
  }
}
