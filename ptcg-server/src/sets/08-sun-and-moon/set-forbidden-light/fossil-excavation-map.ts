import {
  TrainerCard,
  TrainerType,
  StoreLike,
  State,
  GameError,
  GameMessage,
  Player,
  SelectPrompt,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  SEARCH_DECK_FOR_CARDS_TO_HAND,
  SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class FossilExcavationMap extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Fossil Excavation Map';
  public fullName: string = 'Fossil Excavation Map FLI';
  public text: string =
    'Choose 1:\n' +
    '• Search your deck for an Unidentified Fossil card, reveal it, and put it into your hand. Then, shuffle your deck.\n' +
    '• Put an Unidentified Fossil card from your discard pile into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const hasFossilInDiscard = player.discard.cards.some(
      (card) => card.name === 'Unidentified Fossil',
    );
    return player.deck.cards.length > 0 || hasFossilInDiscard;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const options: { message: GameMessage; action: () => void }[] = [];

      if (player.deck.cards.length > 0) {
        options.push({
          message: GameMessage.SEARCH_DECK_FOR_CARD,
          action: () => {
            SEARCH_DECK_FOR_CARDS_TO_HAND(
              store,
              state,
              player,
              this,
              { name: 'Unidentified Fossil' },
              { min: 0, max: 1, allowCancel: false },
            );
          },
        });
      }

      if (player.discard.cards.some((card) => card.name === 'Unidentified Fossil')) {
        options.push({
          message: GameMessage.CHOOSE_CARD_FROM_DISCARD,
          action: () => {
            SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
              store,
              state,
              player,
              this,
              { name: 'Unidentified Fossil' },
              { min: 0, max: 1, allowCancel: false },
            );
          },
        });
      }

      return store.prompt(
        state,
        new SelectPrompt(
          player.id,
          GameMessage.CHOOSE_OPTION,
          options.map((opt) => opt.message),
          { allowCancel: false },
        ),
        (choice) => {
          options[choice].action();
        },
      );
    }

    return state;
  }
}
