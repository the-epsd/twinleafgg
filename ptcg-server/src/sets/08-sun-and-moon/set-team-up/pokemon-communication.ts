import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import {
  MOVE_CARDS,
  SEARCH_DECK_FOR_CARDS_TO_HAND,
  SHOW_CARDS_TO_PLAYER,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
export class PokemonCommunication extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '152';
  public name: string = 'Pokémon Communication';
  public fullName: string = 'Pokemon Communication TEU';
  public text: string =
    'Reveal a Pokemon from your hand and put it into your deck. If you do, ' +
    'search your deck for a Pokemon, reveal it, and put it into your hand. ' +
    'Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    // Need a Pokémon in hand to put into the deck
    return player.hand.cards.some((c) => c.superType === SuperType.POKEMON);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!player.hand.cards.some((c) => c.superType === SuperType.POKEMON)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Do not discard the card yet
      effect.preventDefault = true;

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DECK,
          player.hand,
          { superType: SuperType.POKEMON },
          { min: 1, max: 1, allowCancel: true },
        ),
        (selected) => {
          const cards = selected || [];
          if (cards.length === 0) {
            return;
          }

          // Put Pokemon from hand into the deck
          MOVE_CARDS(store, state, player.hand, player.deck, {
            cards,
            sourceCard: this,
          });
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);

          // Search the deck for a Pokemon
          SEARCH_DECK_FOR_CARDS_TO_HAND(
            store,
            state,
            player,
            this,
            { superType: SuperType.POKEMON },
            { min: 1, max: 1, allowCancel: true },
          );
        },
      );
    }

    return state;
  }
}
