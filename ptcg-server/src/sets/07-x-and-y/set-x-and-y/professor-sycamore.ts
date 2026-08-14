import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';

export class ProfessorSycamore extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'XY';
  public setNumber: string = '122';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Professor Sycamore';
  public fullName: string = 'Professor Sycamore XY';
  public text: string = 'Discard your hand and draw 7 cards. You may play only 1 Supporter card during your turn (before your attack).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const cards = player.hand.cards.filter(c => c !== this);
      if (cards.length > 0) {
        state = MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
      }
      state = DRAW_CARDS(store, state, player, 7);
    }

    return state;
  }
}
