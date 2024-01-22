import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils, GameError, GameMessage, CoinFlipPrompt, ChooseCardsPrompt, Card, CardList, OrderCardsPrompt, ShowCardsPrompt } from '../../game';

export class Cylene extends TrainerCard {

  public regulationMark = 'F';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'ASR';

  public setNumber: string = '138';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Cylene';

  public fullName: string = 'Cylene ASR';

  public text: string =
    'Flip 2 coins. Put a number of cards up to the number of heads from your discard pile on top of your deck in any order.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];
      
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      
      let heads: number = 0;
      store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        results.forEach(r => { heads += r ? 1 : 0; });
      });
      
      if (heads === 0) {
        return state;
      }
      
      const deckTop = new CardList();

      store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { },
        { min: 2, max: 2, allowCancel: false }
      ), selected => {
        cards = selected || [];
      });
    
      player.deck.moveCardsTo(cards, deckTop);
    
    
      return store.prompt(state, new OrderCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARDS_ORDER,
        deckTop,
        { allowCancel: false },
      ), order => {
        if (order === null) {
          return state;
        }
    
        deckTop.applyOrder(order);
        deckTop.moveTo(player.deck);

        if (cards.length > 0) {
          return store.prompt(state, new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards
          ), () => {

            return state;

          });
        }
        return state;
      });
    }
    return state;
  }
}