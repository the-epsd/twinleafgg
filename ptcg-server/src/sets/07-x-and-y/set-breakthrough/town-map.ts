import { Player, State, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TownMap extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';
  public name: string = 'Town Map';
  public fullName: string = 'Town Map BKT';
  public text: string =
    'Turn all of your Prize cards face up. (Those Prize cards remain face up for the rest of the game.)';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      player.prizes.forEach((p) => {
        p.isPublic = true;
        p.faceUpPrize = true;
        p.isSecret = false;
      });
    }

    return state;
  }
}
