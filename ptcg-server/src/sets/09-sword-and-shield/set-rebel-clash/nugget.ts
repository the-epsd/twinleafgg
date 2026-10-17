import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard, StoreLike, State, Player } from '../../../game';

export class Nugget extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'D';
  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '162';
  public name: string = 'Nugget';
  public fullName: string = 'Nugget RCL';
  public text: string =
    'You can play this card only if you drew it from your deck at the beginning of your turn, before you put it into your hand. Draw 3 cards. You may play any number of Item cards during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Note: This card's condition "only if you drew it from your deck at the beginning of your turn"
    // is not currently trackable by the game engine. Leaving unimplemented.

    return state;
  }
}
