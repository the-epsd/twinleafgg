import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { CardList } from '../../game/store/state/card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';


function* playCard(next: Function, store: StoreLike, state: State,
  self: RotomPhone, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  
  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const topFive = new CardList();
  const deckTop = new CardList();
  
  player.deck.moveTo(topFive, 5);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    topFive,
    {  },
    { min: 1, max: 1 }
  ), selected => {
    cards = selected || [];
    
    topFive.moveCardsTo(cards, deckTop);
    next();
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    deckTop.moveToTopOfDestination(player.deck);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
  });
}
      
export class RotomPhone extends TrainerCard {

  public regulationMark = 'D';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'CPA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '64';

  public name: string = 'Rotom Phone';

  public fullName: string = 'Rotom Phone CPA';

  public text: string =
    'Look at the top 5 cards of your deck, choose 1 of them, and shuffle the other cards back into your deck. Then, put the card you chose on top of your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
