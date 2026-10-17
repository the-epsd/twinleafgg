import { ChooseCardsPrompt, GameError, GameMessage, Player, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Hugh,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  effect.preventDefault = true;

  if (opponent.hand.cards.length > 5) {
    const discardAmount = opponent.hand.cards.length - 5;
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        opponent,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { min: discardAmount, max: discardAmount, allowCancel: false },
      ),
      (selected) => {
        const cards = selected || [];
        MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards, sourceCard: self });
        next();
      },
    );
  }

  const cardsInHand = player.hand.cards.filter((c) => c !== self);
  const playerDiscardAmount = cardsInHand.length - 5;

  if (player.hand.cards.length > 5) {
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { min: playerDiscardAmount, max: playerDiscardAmount, allowCancel: false },
      ),
      (selected) => {
        const cards = selected || [];
        MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: self });
        next();
      },
    );
  }

  return state;
}

export class Hugh extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '130';
  public name: string = 'Hugh';
  public fullName: string = 'Hugh BCR';
  public text: string =
    'Both players discard cards from their hand until they each have 5 cards in hand. (Your opponent discards first. Any player with 5 cards or less in their hands do not discard any cards.)';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}
