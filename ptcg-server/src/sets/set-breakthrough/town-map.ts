import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class TownMap extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BKT';

  public name: string = 'Town Map';

  public fullName: string = 'Town Map BKT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '150';

  public text: string =
    'Turn all of your Prize cards face up. (Those Prize cards remain ' +
    'face up for the rest of the game.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      player.prizes.forEach(p => {
        p.isPublic = true;
        p.faceUpPrize = true;
        p.isSecret = false;
      });
      effect.player.hand.moveCardTo(effect.trainerCard, effect.player.supporter);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    return state;
  }

}
