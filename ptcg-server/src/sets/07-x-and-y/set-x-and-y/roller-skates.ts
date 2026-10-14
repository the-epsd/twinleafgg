import { GameError, GameMessage, Player, State, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class RollerSkates extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '125';
  public name: string = 'Roller Skates';
  public fullName: string = 'Roller Skates XY';
  public text: string = 'Flip a coin. If heads, draw 3 cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result) {
          DRAW_CARDS(store, state, player, 3);
        }
      });
    }

    return state;
  }
}
