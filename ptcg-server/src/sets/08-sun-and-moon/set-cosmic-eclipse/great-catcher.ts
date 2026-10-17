import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { GUST_OPPONENT_BENCHED_POKEMON, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import {
  PlayerType,
  StateUtils,
  GameError,
  GameMessage,
  Card,
  CardTarget,
  ChooseCardsPrompt,
  CardList,
  Player,
} from '../../../game';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: GreatCatcher,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // If opponent doesn't have any valid cards on their bench,
  // or if we don't have at least two cards in hand, we can't play this card.
  const cards: Card[] = player.hand.cards.filter((c) => c !== self);
  if (!self.hasGxOrExOnBench(opponent) || cards.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Discard cards (excluding this card from the prompt)
  const handTemp = new CardList();
  handTemp.cards = cards;
  let discardCards: Card[] = [];
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
      discardCards = selected || [];
      next();
    },
  );

  if (discardCards.length == 0) {
    return state;
  } // Operation canceled by the user

  // Can't cancel next prompt, so now discard things
  MOVE_CARDS(store, state, player.hand, player.discard, { cards: discardCards, sourceCard: self });

  // Can only gust EX or GX
  const gustBlocked: CardTarget[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (!card.hasTag(CardTag.POKEMON_GX) && !card.hasTag(CardTag.POKEMON_EX)) {
      gustBlocked.push(target);
    }
  });

  // Gust effect
  return GUST_OPPONENT_BENCHED_POKEMON(store, state, player, { blocked: gustBlocked });
}

export class GreatCatcher extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '192';
  public name: string = 'Great Catcher';
  public fullName: string = 'Great Catcher CEC';
  public text: string =
    "You can play this card only if you discard two other cards. Switch 1 of your opponent's Benched Pokemon-GX or Pokemon-EX " +
    'with their Active Pokemon.';

  public hasGxOrExOnBench(opponent: Player): boolean {
    return opponent.bench.some(
      (b) =>
        b.getPokemonCard()?.hasTag(CardTag.POKEMON_GX) ||
        b.getPokemonCard()?.hasTag(CardTag.POKEMON_EX),
    );
  }

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    if (!this.hasGxOrExOnBench(opponent)) {
      return false;
    }
    // Need two other cards in hand to discard
    if (player.hand.cards.filter((c) => c !== this).length < 2) {
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
