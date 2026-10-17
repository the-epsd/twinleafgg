import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, Card, PokemonCard, ChooseCardsPrompt } from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: SacredAsh,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;

  const pokemonsInDiscard = player.discard.cards.filter((c) => c instanceof PokemonCard).length;

  // Player does not have correct cards in discard
  if (pokemonsInDiscard === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const max = Math.min(5, pokemonsInDiscard);
  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.discard,
      { superType: SuperType.POKEMON },
      { min: max, max, allowCancel: true },
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

  MOVE_CARDS(store, state, player.discard, player.deck, { cards: cards, sourceCard: self });

  return SHUFFLE_DECK(store, state, player);
}

export class SacredAsh extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Sacred Ash';
  public fullName: string = 'Sacred Ash FLF';
  public text: string = 'Shuffle 5 Pokemon from your discard pile into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.discard.cards.some((c) => c instanceof PokemonCard);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
