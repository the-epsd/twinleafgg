import { CardList, ChooseCardsPrompt, EnergyCard } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Kindler, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }
  
  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  
  const hasEnergyInHand = player.hand.cards.some(c => {
    return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Fire Energy';
  });
  
  if (!hasEnergyInHand) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  
  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  
  state = store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    player.hand,
    { superType: SuperType.ENERGY },
    { allowCancel: false, min: 1, max: 1 }
  ), cards => {
    cards = cards || [];
    if (cards.length === 0) {
      return;
    }

    player.hand.moveCardsTo(cards, player.discard);
  });
  
      
  const deckTop = new CardList();
  player.deck.moveTo(deckTop, 7);
      
  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    deckTop,
    { },
    { min: 0, max: 2, allowCancel: false }
  ), selected => {
    deckTop.moveCardsTo(selected, player.hand);
    deckTop.moveTo(player.deck);
    
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    
    
    return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      return state;
    });
  });
}

export class Kindler extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '143';

  public regulationMark = 'H';

  public name: string = 'Kindler';

  public fullName: string = 'Kindler BRS';

  public text: string =
    'You can use this card only if you discard a [R] Energy card from your hand.' + 
    '' + 
    'Look at the top 7 cards of your deck and put up to 2 of them into your hand. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}