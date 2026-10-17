import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';

export class AromaLady extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '141';
  public name: string = 'Aroma Lady';
  public fullName: string = 'Aroma Lady EVS';
  public text: string =
    'Draw 2 cards. If you do, your Active Pokémon recovers from all Special Conditions. You may play only 1 Supporter card during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      DRAW_CARDS(store, state, player, 2);
      // Remove all special conditions from active pokemon
      player.active.specialConditions = [];
    }

    return state;
  }
}
