import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard, StoreLike, State, StateUtils, Player } from '../../../game';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LeagueStaff extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'D';
  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '153';
  public name: string = 'League Staff';
  public fullName: string = 'League Staff VIV';
  public text: string =
    'Draw 2 cards. If Wyndon Stadium is in play, draw 2 more cards. You may play only 1 Supporter card during your turn.';

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

      // Check if Wyndon Stadium is in play
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard && stadiumCard.name === 'Wyndon Stadium') {
        DRAW_CARDS(store, state, player, 2);
      }
    }

    return state;
  }
}
