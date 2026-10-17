import { Card, CardList, ChooseCardsPrompt, GameMessage, Player, State, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ReservedTicket extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '147';
  public name: string = 'Reserved Ticket';
  public fullName: string = 'Reserved Ticket BKT';
  public text: string = 'Flip a coin. If heads, search your deck for a card, shuffle your deck, then put that card on top of it.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result) {
          if (player.deck.cards.length === 0) {
            return;
          }

          let cards: Card[] = [];
          const deckTop = new CardList();

          store.prompt(
            state,
            new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARDS,
              player.deck,
              {},
              { min: 1, max: 1, allowCancel: false },
            ),
            (selected) => {
              cards = selected || [];
              if (cards.length > 0) {
                MOVE_CARDS(store, state, player.deck, deckTop, { cards: cards, sourceCard: this });

                SHUFFLE_DECK(store, state, player);
                // Put the chosen card on top once the shuffle has fully resolved
                store.waitPrompt(state, () => {
                  deckTop.moveToTopOfDestination(player.deck);
                });
              }
            },
          );
        }
      });
    }

    return state;
  }
}
