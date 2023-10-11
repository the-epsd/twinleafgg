import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameMessage } from '../../game/game-message';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  let coin1Result = false;
  let coin2Result = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
    coin1Result = result;
    next();
  });
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
    coin2Result = result;
    next();
  });
  if (coin1Result && coin2Result) { 
    let cards: any[] = [];
    yield store.prompt(state, new ChooseCardsPrompt(player.id, GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), (selected: any[]) => {
      cards = selected || [];
      next();
    });
    player.deck.moveCardsTo(cards, player.hand);
  }
  return store.prompt(state, new ShuffleDeckPrompt(player.id), (order: any[]) => {
    player.deck.applyOrder(order);
  });
}

export class DeliveryDrone extends TrainerCard {

  public regulationMark = 'G';
  
  public trainerType = TrainerType.ITEM;
  public set = 'PAL';
  public set2: string = 'paldeaevolved';
  public setNumber: string = '178';
  public name = 'Delivery Drone';
  public fullName: string = 'Delivery Drone PAL 178';
  public text: string = 'Discard 2 cards from your hand. (If you can\'t discard 2 cards, ' + 
                            'you can\'t play this card.) Search your deck for a card and put it into ' + 
                            'your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
                                                    
    return state;
  }
}                         