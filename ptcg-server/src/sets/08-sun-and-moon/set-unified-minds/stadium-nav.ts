import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { State } from '../../../game/store/state/state';
import { Player } from '../../../game/store/state/player';
import { StoreLike } from '../../../game/store/store-like';
import {
  MULTIPLE_COIN_FLIPS_PROMPT,
  MOVE_CARDS,
  SEARCH_DECK_FOR_CARDS_TO_HAND,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class StadiumNav extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '208';
  public name: string = 'Stadium Nav';
  public fullName: string = 'Stadium Nav UNM';
  public text: string =
    'Flip 2 coins. For each heads, search your deck for a Stadium card, reveal it, and put it into your hand. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
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

      effect.preventDefault = true;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, (results) => {
        const heads = results.filter((r) => r).length;

        if (heads === 0) {
          return;
        }

        SEARCH_DECK_FOR_CARDS_TO_HAND(
          store,
          state,
          player,
          this,
          { superType: SuperType.TRAINER, trainerType: TrainerType.STADIUM } as Partial<TrainerCard>,
          { min: 0, max: heads, allowCancel: false },
        );
      });
    }

    return state;
  }
}
