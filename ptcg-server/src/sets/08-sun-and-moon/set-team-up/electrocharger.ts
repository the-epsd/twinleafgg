import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  Card,
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StoreLike,
  TrainerCard,
} from '../../../game';
import {
  MOVE_CARDS,
  MULTIPLE_COIN_FLIPS_PROMPT,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Electrocharger extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'Electrocharger';
  public fullName: string = 'Electrocharger TEU';
  public text: string =
    'Flip 2 coins. For each heads, shuffle an Electropower card from your discard pile into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    // Need an Electropower card in the discard pile
    return player.discard.cards.some((c) => c instanceof TrainerCard && c.name === 'Electropower');
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Check if there are any Electropower cards in the discard pile
      const electropowerCards = player.discard.cards.filter(
        (c) => c instanceof TrainerCard && c.name === 'Electropower',
      );

      if (electropowerCards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, (results) => {
        const heads = results.filter((r) => r).length;
        if (heads === 0) {
          return;
        }

        const availableCards = player.discard.cards.filter(
          (c) => c instanceof TrainerCard && c.name === 'Electropower',
        );

        const maxToShuffle = Math.min(heads, availableCards.length);
        if (maxToShuffle === 0) {
          return;
        }

        store.prompt(
          state,
          new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DECK,
            player.discard,
            { name: 'Electropower' },
            { min: maxToShuffle, max: maxToShuffle, allowCancel: false },
          ),
          (selected: Card[] | null) => {
            const cards = selected || [];
            if (cards.length > 0) {
              MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: this });
              SHUFFLE_DECK(store, state, player);
            }
          },
        );
      });
    }

    return state;
  }
}
