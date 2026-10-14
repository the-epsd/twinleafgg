import { TrainerType } from '../../../game/store/card/card-types';
import { Card } from '../../../game/store/card/card';
import {
  StoreLike,
  State,
  GameError,
  GameMessage,
  StateUtils,
  TrainerCard,
  Player,
  ChooseCardsPrompt,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SHUFFLE_DECK, MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Morty extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '186';
  public name: string = 'Morty';
  public fullName: string = 'Morty LOT';
  public text: string =
    "You can play this card only if 1 of your Psychic Pok\u00e9mon was Knocked Out during your opponent's last turn. Your opponent reveals their hand. Choose 2 cards you find there. Your opponent shuffles those cards into their deck. You may play only 1 Supporter card during your turn (before your attack).";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    // TODO: "1 of your Psychic Pokemon was Knocked Out during your opponent's last turn" is not tracked by type.
    const opponent = StateUtils.getOpponent(state, player);
    return opponent.hand.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);

      const maxCards = Math.min(2, opponent.hand.cards.length);

      store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DECK,
          opponent.hand,
          {},
          { min: 1, max: maxCards, allowCancel: false },
        ),
        (selected: Card[]) => {
          const cards = selected || [];
          cards.forEach((c) => {
            MOVE_CARDS(store, state, opponent.hand, opponent.deck, {
              cards: [c],
              sourceCard: this,
            });
          });
          if (cards.length > 0) {
            SHUFFLE_DECK(store, state, opponent);
          }
        },
      );
    }

    return state;
  }
}
