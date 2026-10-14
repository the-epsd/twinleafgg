import { Card, CardList, GameError, GameMessage, Player, State, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

const ITEM_TYPES = [TrainerType.ITEM, TrainerType.TOOL];

function canPlayJunkArm(player: Player, self: JunkArm): boolean {
  const handCards = player.hand.cards.filter((c) => c !== self);
  if (handCards.length < 2) {
    return false;
  }

  return player.discard.cards.some(
    (c) => c instanceof TrainerCard && ITEM_TYPES.includes(c.trainerType) && c.name !== self.name,
  );
}

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: JunkArm,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  if (!canPlayJunkArm(player, self)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter((c) => c !== self);

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      handTemp,
      {},
      { min: 2, max: 2, allowCancel: true },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length === 0) {
    return state;
  }

  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    if (!(c instanceof TrainerCard)) {
      blocked.push(index);
      return;
    }
    if (!ITEM_TYPES.includes(c.trainerType) || c.name === self.name) {
      blocked.push(index);
    }
  });

  let recovered: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      {},
      { min: 1, max: 1, allowCancel: true, blocked },
    ),
    (selected) => {
      recovered = selected || [];
      next();
    },
  );

  if (recovered.length === 0) {
    return state;
  }

  MOVE_CARDS(store, state, player.hand, player.discard, { cards: [self], sourceCard: self });
  MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: self });
  MOVE_CARDS(store, state, player.discard, player.hand, { cards: recovered, sourceCard: self });

  return state;
}

export class JunkArm extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Junk Arm';
  public fullName: string = 'Junk Arm TM';
  public text: string =
    'Discard 2 cards from your hand. Search your discard pile for a Trainer ' +
    "card, show it to your opponent, and put it into your hand. You can't " +
    'choose Junk Arm with the effect of this card.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return canPlayJunkArm(player, this);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}
