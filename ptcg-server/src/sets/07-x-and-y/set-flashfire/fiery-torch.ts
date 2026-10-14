import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, Card, EnergyCard, ChooseCardsPrompt } from '../../../game';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: FieryTorch,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  cards = player.hand.cards.filter(
    (c) =>
      c !== self &&
      c instanceof EnergyCard &&
      c.energyType === EnergyType.BASIC &&
      c.name === 'Fire Energy',
  );

  if (cards.length < 1) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      player.hand,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
      { min: 1, max: 1, allowCancel: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: self });
  DRAW_CARDS(store, state, player, 2);

  return state;
}

export class FieryTorch extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Fiery Torch';
  public fullName: string = 'Fiery Torch FLF';
  public text: string =
    "Discard a [R] Energy card from your hand. (If you can't discard a [R] Energy card, you can't play this card.) Draw 2 cards.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const hasFireEnergy = player.hand.cards.some(
      (c) =>
        c !== this &&
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.name === 'Fire Energy',
    );
    return hasFireEnergy && player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
