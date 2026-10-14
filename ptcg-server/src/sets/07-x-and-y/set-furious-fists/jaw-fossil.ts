import {
  CardList,
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StateUtils,
  StoreLike,
} from '../../../game';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonFromDeckEffect } from '../../../game/store/effects/play-card-effects';
import {
  GET_CARDS_ON_BOTTOM_OF_DECK,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class JawFossil extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FFI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Jaw Fossil';
  public fullName: string = 'Jaw Fossil FFI';
  public text: string =
    'Look at the bottom 7 cards of your deck. You may reveal a Tyrunt you find there and put it onto your Bench. Shuffle the other cards back into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const slots = player.bench.filter((b) => b.cards.length === 0);
      const max = Math.min(slots.length, 1);

      const deckBottom = new CardList();
      deckBottom.cards = GET_CARDS_ON_BOTTOM_OF_DECK(player, 7);

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          deckBottom,
          { superType: SuperType.POKEMON, name: 'Tyrunt' },
          { min: 0, max, allowCancel: true },
        ),
        (selected) => {
          const cards = selected || [];

          if (cards.length > 0) {
            SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          }

          cards.slice(0, slots.length).forEach((card, index) => {
            store.reduceEffect(
              state,
              new PlayPokemonFromDeckEffect(player, card as PokemonCard, slots[index]),
            );
          });

          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
