import { ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, self: EcoArm, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const toolCards = player.discard.cards.filter(c => {
    return c instanceof TrainerCard && c.trainerType === TrainerType.TOOL;
  }).length;

  if (toolCards === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  const min = Math.min(3, toolCards);
  
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
    { min, max: 3, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    player.discard.moveCardsTo(cards, player.deck);
    cards.forEach((card, index) => {
      store.log(state, GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
      state = store.prompt(state, new ShowCardsPrompt(
        opponent.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        cards), () => state);
    }

  }
  
  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class EcoArm extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'AOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Eco Arm';

  public fullName: string = 'Eco Arm AOR';

  public text: string =
    'Shuffle 3 Pokémon Tool cards from your discard pile into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
