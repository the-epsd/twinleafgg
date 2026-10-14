import { Card } from '../../../game/store/card/card';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { Player, ShowCardsPrompt, State, StateUtils, StoreLike } from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: RandomReceiver,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;
  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });

  const revealed: Card[] = [];
  let supporter: Card | undefined;

  for (let i = 0; i < player.deck.cards.length; i++) {
    const card = player.deck.cards[i];
    revealed.push(card);

    if (card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER) {
      supporter = card;
      break;
    }
  }

  yield store.prompt(
    state,
    [
      new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, revealed),
      new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, revealed),
    ],
    () => next(),
  );

  if (supporter !== undefined) {
    MOVE_CARDS(store, state, player.deck, player.hand, {
      cards: [supporter],
      sourceCard: self,
      sourceEffect: effect,
    });
  }

  SHUFFLE_DECK(store, state, player);
  MOVE_CARDS(store, state, player.supporter, player.discard, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });

  return state;
}

export class RandomReceiver extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'DEX';
  public name: string = 'Random Receiver';
  public fullName: string = 'Random Receiver DEX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public text: string =
    'Reveal cards from the top of your deck until you reveal a Supporter ' +
    'card. Put it into your hand. Shuffle the other cards back into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
