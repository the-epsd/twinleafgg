import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player } from '../../../game';
import {
  MOVE_CARDS,
  SELECT_PROMPT_WITH_OPTIONS,
  SHUFFLE_HAND_INTO_DECK_THEN_DRAW,
  SWITCH_ACTIVE_WITH_BENCHED,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TateAndLiza extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '148';
  public name: string = 'Tate & Liza';
  public fullName: string = 'Tate & Liza CES';
  public text: string =
    'Choose 1:' +
    '• Shuffle your hand into your deck. Then, draw 5 cards.' +
    '• Switch your Active Pokémon with 1 of your Benched Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Need a Benched Pokémon to switch with, or a deck to draw from
    const hasBench = player.bench.some((b) => b.cards.length > 0);
    if (!hasBench && player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const options: { message: GameMessage; action: () => void }[] = [];

      if (player.bench.some((b) => b.cards.length > 0)) {
        options.push({
          message: GameMessage.SWITCH_POKEMON,
          action: () => {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          },
        });
      }

      if (player.deck.cards.length > 0) {
        options.push({
          message: GameMessage.SHUFFLE_YOUR_HAND,
          action: () => {
            SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, player, {
              excludeCard: effect.trainerCard,
              sourceCard: this,
              drawCount: 5,
            });
          },
        });
      }

      return SELECT_PROMPT_WITH_OPTIONS(store, state, player, GameMessage.CHOOSE_OPTION, options);
    }

    return state;
  }
}
