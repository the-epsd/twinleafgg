import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard, GameMessage, Player, StoreLike, State, StateUtils } from '../../../game';
import { DRAW_CARDS, CONFIRMATION_PROMPT } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Wallace extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '166';
  public name: string = 'Wallace';
  public fullName: string = 'Wallace SIT 166';
  public text: string =
    'Draw 3 cards. Your opponent may draw a card. If they do, draw 1 more card. You may play only 1 Supporter card during your turn.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Draw 3 cards first
      DRAW_CARDS(store, state, player, 3);

      // Opponent may draw a card; if they do, draw 1 more
      if (opponent.deck.cards.length > 0) {
        CONFIRMATION_PROMPT(
          store,
          state,
          opponent,
          (result) => {
            if (result) {
              DRAW_CARDS(store, state, opponent, 1);
              DRAW_CARDS(store, state, player, 1);
            }
          },
          GameMessage.WANT_TO_DRAW_CARDS,
        );
      }
    }

    return state;
  }
}
