import {
  CardList,
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '../../../game';
import { SuperType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonFromDeckEffect } from '../../../game/store/effects/play-card-effects';
import {
  GET_CARDS_ON_BOTTOM_OF_DECK,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class RootFossilLileep extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'PLB';
  public setNumber: string = '87';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Root Fossil Lileep';
  public fullName: string = 'Root Fossil Lileep PLB';
  public text: string =
    'Look at the bottom 7 cards of your deck. You may reveal a Lileep you find there and put it onto your Bench. Shuffle the other cards back into your deck.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    if (!player.bench.some((b) => b.cards.length === 0)) {
      return false;
    }
    return true;
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
          { superType: SuperType.POKEMON, name: 'Lileep' },
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
