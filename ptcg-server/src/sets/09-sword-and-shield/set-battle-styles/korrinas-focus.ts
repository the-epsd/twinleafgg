import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { Player } from '../../../game';

export class KorrinasFocus extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  protected _tags = [CardTag.RAPID_STRIKE];
  public regulationMark = 'E';
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '128';
  public name: string = "Korrina's Focus";
  public fullName: string = "Korrina's Focus BST";
  public text: string = 'Draw cards until you have 6 cards in your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      DRAW_CARDS(store, state, player, Math.max(6 - player.hand.cards.length, 0));
      return state;
    }
    return state;
  }
}
