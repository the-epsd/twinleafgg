import { ChooseCardsPrompt, GameError, GameMessage } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BillsMaintenance extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Bill\'s Maintenance';
  public fullName: string = 'Bill\'s Maintenance RG';

  public text: string =
    'If you have any cards in your hand, shuffle 1 of them into your deck, then draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.hand.cards.length < 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_SHUFFLE,
        player.hand,
        {},
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        player.hand.moveCardsTo(cards, player.deck);
        SHUFFLE_DECK(store, state, player);
        DRAW_CARDS(player, 3);
      });

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      return state;
    }

    return state;
  }
}