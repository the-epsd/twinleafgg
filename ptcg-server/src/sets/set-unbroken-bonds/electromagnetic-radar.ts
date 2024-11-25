import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card, GameError, GameMessage, CardList, ChooseCardsPrompt, GameLog, ShowCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

function* playCard(next: Function, store: StoreLike, state: State, self: ElectromagneticRadar, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  cards = player.hand.cards.filter(c => c !== self);
  if (cards.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  // prepare card list without Junk Arm
  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter(c => c !== self);

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    handTemp,
    {},
    { min: 2, max: 2, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  player.hand.moveCardsTo(cards, player.discard);

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    // eslint-disable-next-line no-empty
    if ((card.tags.includes(CardTag.POKEMON_GX)) ||
      (card.tags.includes(CardTag.POKEMON_EX)) || (card.tags.includes(CardTag.TAG_TEAM))) {
      /**/
    } else {
      blocked.push(index);
    }
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON, cardType: CardType.LIGHTNING },
    { min: 0, max: 2, allowCancel: false, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  cards.forEach((card, index) => {
    store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  player.deck.moveCardsTo(cards, player.hand);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class ElectromagneticRadar extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '169';

  public name: string = 'Electromagnetic Radar';

  public fullName: string = 'Electromagnetic Radar UNB';

  public text: string = 'You can play this card only if you discard 2 other cards from your hand.' +
    'Search your deck for up to 2 in any combination of[L] Pokémon - GX and[L] Pokémon - EX, '
    + 'reveal them, and put them into your hand. Then, shuffle your deck.'

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}