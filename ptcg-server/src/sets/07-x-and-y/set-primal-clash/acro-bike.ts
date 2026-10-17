import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, CardList, ChooseCardsPrompt } from '../../../game';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class AcroBike extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '122';
  public name: string = 'Acro Bike';
  public fullName: string = 'Acro Bike PRC';
  public text: string =
    'Look at the top 2 cards of your deck and put 1 of them into your hand. Discard the other card.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 2, sourceCard: this });
      SHOW_CARDS_TO_PLAYER(store, state, player, deckTop.cards);

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          deckTop,
          {},
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          MOVE_CARDS(store, state, deckTop, player.hand, { cards: selected, sourceCard: this });
          MOVE_CARDS(store, state, deckTop, player.discard, { sourceCard: this });
        },
      );
    }

    return state;
  }
}
