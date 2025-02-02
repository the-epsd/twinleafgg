import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect, TrainerToDeckEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, self: PalPad, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasSupporter = player.discard.cards.some(c => {
    return c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER;
  });

  if (!hasSupporter) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
    { min: 0, max: 2, allowCancel: false }
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

export class PalPad extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '182';

  public name: string = 'Pal Pad';

  public fullName: string = 'Pal Pad SVI';

  public text: string =
    'Shuffle up to 2 Supporter cards from your discard pile into' +
    'your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      // Check if TrainerToDeckEffect is prevented
      const discardEffect = new TrainerToDeckEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        // If prevented, just discard the card and return
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      }

      // If not prevented, proceed with the original effect
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}
