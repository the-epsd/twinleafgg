import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  GameError,
  GameMessage,
  Player,
  SlotType,
  State,
  StoreLike,
  TrainerCard,
} from '../../../game';
import {
  LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY,
  MOVE_CARDS,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Morgan extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '149';
  public name: string = 'Morgan';
  public fullName: string = 'Morgan TEU';
  public text: string =
    'You can play this card only if you discard Dana, Evelyn, and Nita from your hand. Look at the top 12 cards of your deck and attach any number of Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Need Dana, Evelyn, and Nita in hand
    const names = ['Dana', 'Evelyn', 'Nita'];
    return names.every((name) => player.hand.cards.some((c) => c.name === name));
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // Check for Dana, Evelyn, and Nita in hand
      const danaCard = player.hand.cards.find((c) => c.name === 'Dana');
      const evelynCard = player.hand.cards.find((c) => c.name === 'Evelyn');
      const nitaCard = player.hand.cards.find((c) => c.name === 'Nita');

      if (!danaCard || !evelynCard || !nitaCard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Discard Dana, Evelyn, and Nita
      MOVE_CARDS(store, state, player.hand, player.discard, {
        cards: [danaCard, evelynCard, nitaCard],
        sourceCard: this,
      });

      if (player.deck.cards.length === 0) {
        return state;
      }

      // Look at top 12 and attach any number of Energy
      return LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY(store, state, player, 12, 12, {
        destinationSlots: [SlotType.ACTIVE, SlotType.BENCH],
        energyFilter: {},
        remainderDestination: 'shuffle',
      });
    }

    return state;
  }
}
