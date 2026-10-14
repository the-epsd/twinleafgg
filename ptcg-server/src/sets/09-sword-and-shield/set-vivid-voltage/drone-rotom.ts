import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  StoreLike,
  State,
  StateUtils,
  GameMessage,
  CardList,
  ShowCardsPrompt,
  Player,
} from '../../../game';
import { SHOW_CARDS_TO_PLAYER, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class DroneRotom extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'D';
  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '151';
  public name: string = 'Drone Rotom';
  public fullName: string = 'Drone Rotom VIV';
  public text: string =
    "Your opponent reveals their hand. If they do, look at the top card of your opponent's deck. You may play any number of Item cards during your turn.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Reveal opponent's hand
      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);

      // Look at top card of opponent's deck
      if (opponent.deck.cards.length > 0) {
        const deckTop = new CardList();
        MOVE_CARDS(store, state, opponent.deck, deckTop, { count: 1, sourceCard: this });

        store.prompt(
          state,
          new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, deckTop.cards),
          () => {
            // Put card back on top of opponent's deck
            opponent.deck.cards = [...deckTop.cards, ...opponent.deck.cards];
          },
        );
      }
    }

    return state;
  }
}
