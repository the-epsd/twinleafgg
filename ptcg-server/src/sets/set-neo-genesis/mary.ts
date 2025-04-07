import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt, ShuffleDeckPrompt } from '../../game';

export class Mary extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'N1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Mary';
  public fullName: string = 'Mary N1';

  public text: string =
    'Draw 2 cards. Then, shuffle 2 cards from your hand into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const cardsToDraw = Math.min(2, player.deck.cards.length);
      DRAW_CARDS(player, cardsToDraw);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_SHUFFLE,
        player.hand,
        {},
        { allowCancel: false, min: 2, max: 2 }
      ), selected => {
        selected.forEach(card => {
          player.hand.moveCardTo(card, player.deck);
        });
        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
        });
      });
    }
    return state;
  }

}
