import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt, GameMessage } from '../../game';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND } from '../../game/store/prefabs/prefabs';

export class IrisFightingSpirit extends TrainerCard {

  public regulationMark = 'I';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '94';

  public name: string = 'Iris\'s Fighting Spirit';

  public fullName: string = 'Iris\'s Fighting Spirit SV9';

  public text: string =
    'Discard a card from your hand. If you do, draw cards until you have 6 cards in your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 0, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        player.hand.moveCardsTo(cards, player.discard);
        if (player.hand.cards.length >= 6) {
          return;
        }

        DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
      });

      return state;
    }
    return state;
  }
}