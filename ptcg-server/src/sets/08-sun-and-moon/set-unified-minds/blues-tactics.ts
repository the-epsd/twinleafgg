import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, DRAW_CARDS_UNTIL_CARDS_IN_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class BluesTactics extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '188';
  public name: string = "Blue's Tactics";
  public fullName: string = "Blue's Tactics UNM";
  public text: string =
    'At the end of this turn, draw cards until you have 8 cards in your hand. You may play only 1 Supporter card during your turn (before your attack).';
  public readonly BLUES_TACTICS_MARKER = 'BLUES_TACTICS_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
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

      ADD_MARKER(this.BLUES_TACTICS_MARKER, player, this);
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.BLUES_TACTICS_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.BLUES_TACTICS_MARKER, effect.player, this);
      DRAW_CARDS_UNTIL_CARDS_IN_HAND(effect.player, 8);
    }

    return state;
  }
}
