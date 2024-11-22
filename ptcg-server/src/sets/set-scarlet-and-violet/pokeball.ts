import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameLog, GameMessage } from '../../game/game-message';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils, ShowCardsPrompt } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let coinResult = false;

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
    coinResult = result;
    next();
  });

  if (coinResult) { 
    let cards: any[] = [];
    yield store.prompt(state, new ChooseCardsPrompt(
      player, 
      GameMessage.CHOOSE_CARD_TO_HAND, 
      player.deck, 
      { superType: SuperType.POKEMON }, 
      { min: 0, max: 1, allowCancel: false }), 
    (selected: any[]) => {
      cards = selected || [];
      next();
    });

    if (cards.length > 0) {
      player.discard.moveCardsTo(cards, player.deck);
      cards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
      });
      if (cards.length > 0) {
        state = store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards), () => state);
      }
    }

    player.deck.moveCardsTo(cards, player.hand);
  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), (order: any[]) => {
    player.deck.applyOrder(order);
  });
}

export class Pokeball extends TrainerCard {

  public regulationMark = 'G';
  
  public trainerType = TrainerType.ITEM;

  public set = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '185';

  public name = 'Poké Ball';

  public fullName: string = 'Poké Ball SVI';

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