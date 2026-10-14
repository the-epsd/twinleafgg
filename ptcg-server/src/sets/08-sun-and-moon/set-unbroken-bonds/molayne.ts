import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardType, EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player, GameError, GameMessage, StateUtils, EnergyCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { Card } from '../../../game/store/card/card';
import { SHUFFLE_DECK, MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function isBasicMetalEnergy(c: Card): boolean {
  return (
    c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.METAL)
  );
}

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Molayne,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  // Check if player has at least 2 Metal Energy cards in hand (excluding this card)
  const metalEnergyInHand = player.hand.cards.filter((c) => c !== self && isBasicMetalEnergy(c));
  if (metalEnergyInHand.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Check if there is a Trainer card in the discard pile
  const trainerInDiscard = player.discard.cards.some((c) => c.superType === SuperType.TRAINER);
  if (!trainerInDiscard) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Move to supporter zone, prevent default discard
  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });
  effect.preventDefault = true;

  // Step 1: Discard 2 Metal Energy cards from hand
  const blocked: number[] = [];
  player.hand.cards.forEach((c, index) => {
    if (!isBasicMetalEnergy(c)) {
      blocked.push(index);
    }
  });

  let discardedCards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      player.hand,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min: 2, max: 2, allowCancel: false, blocked },
    ),
    (selected) => {
      discardedCards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.hand, player.discard, { cards: discardedCards, sourceCard: self });

  // Step 2: Choose a Trainer card from discard pile to shuffle into deck
  let chosenCards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.discard,
      { superType: SuperType.TRAINER },
      { min: 1, max: 1, allowCancel: false },
    ),
    (selected) => {
      chosenCards = selected || [];
      next();
    },
  );

  if (chosenCards.length > 0) {
    MOVE_CARDS(store, state, player.discard, player.deck, { cards: chosenCards, sourceCard: self });
    SHOW_CARDS_TO_PLAYER(store, state, opponent, chosenCards);
  }

  return SHUFFLE_DECK(store, state, player);
}

export class Molayne extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '181';
  public name: string = 'Molayne';
  public fullName: string = 'Molayne UNB';
  public text: string =
    'You can play this card only if you discard 2 [M] Energy cards from your hand. Shuffle a Trainer card from your discard pile into your deck. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.hand.cards.filter((c) => c !== this && isBasicMetalEnergy(c)).length < 2) {
      return false;
    }
    if (!player.discard.cards.some((c) => c.superType === SuperType.TRAINER)) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
