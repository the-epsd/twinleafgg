import { TrainerType } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  StateUtils,
  GameError,
  GameMessage,
  Player,
  TrainerCard,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_A_STADIUM_CARD_IN_PLAY } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Bonnie extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public name: string = 'Bonnie';
  public fullName: string = 'Bonnie FLI';
  public text: string =
    'You can play this card only if there is any Stadium card in play. Discard that Stadium card. During this turn, your Zygarde-GX can use its GX attack even if you have used your GX attack. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return StateUtils.getStadiumCard(state) !== undefined;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (StateUtils.getStadiumCard(state) === undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      DISCARD_A_STADIUM_CARD_IN_PLAY(state);

      // Allow Zygarde-GX to use its GX attack this turn
      player.usedGX = false;
    }

    return state;
  }
}
