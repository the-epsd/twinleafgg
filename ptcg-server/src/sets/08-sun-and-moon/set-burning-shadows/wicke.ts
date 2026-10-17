import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SHUFFLE_HAND_INTO_DECK_THEN_DRAW } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Wicke extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '127';
  public name: string = 'Wicke';
  public fullName: string = 'Wicke BUS';
  public text: string =
    'Each player counts the cards in their hand, shuffles those cards into their deck, then draws that many cards. You may play only 1 Supporter card during your turn (before your attack).';

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

      // Count cards in each player's hand (excluding this card for the player)
      const playerHandCount = player.hand.cards.filter((c) => c !== this).length;
      const opponentHandCount = opponent.hand.cards.length;

      // Player shuffles hand into deck and draws, then the opponent does the same
      return SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, player, {
        excludeCard: this,
        sourceCard: this,
        drawCount: playerHandCount,
        afterDraw: () => {
          SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, opponent, {
            sourceCard: this,
            drawCount: opponentHandCount,
          });
        },
      });
    }

    return state;
  }
}
