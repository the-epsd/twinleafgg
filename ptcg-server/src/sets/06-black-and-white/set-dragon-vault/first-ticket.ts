import { GameLog, Player, State, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WhoBeginsEffect } from '../../../game/store/effects/game-phase-effects';
import { GamePhase } from '../../../game/store/state/state';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class FirstTicket extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'DRV';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'First Ticket';
  public fullName: string = 'First Ticket DRV';
  public text: string =
    "Before you flip a coin to decide who goes first in a game, you may play this card. Don't flip that coin, and you go first. If both players play First Ticket, flip the coin as normal. (You may play only 1 First Ticket before you flip that coin.)";

  public readonly FIRST_TICKET_MARKER = 'FIRST_TICKET_MARKER';

  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    if (state.phase !== GamePhase.SETUP) {
      return false;
    }
    if (player.marker.hasMarker(this.FIRST_TICKET_MARKER, this)) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      if (!this.canPlay(store, state, player)) {
        return state;
      }
      player.marker.addMarker(this.FIRST_TICKET_MARKER, this);
    }

    if (effect instanceof WhoBeginsEffect) {
      const playersWithTicket = state.players.filter((p) =>
        p.marker.hasMarker(this.FIRST_TICKET_MARKER, this),
      );

      if (playersWithTicket.length === 1) {
        store.log(state, GameLog.LOG_STARTS_BECAUSE_OF_ABILITY, {
          name: playersWithTicket[0].name,
          ability: this.name,
        });
        effect.player = playersWithTicket[0];
      }
    }

    return state;
  }
}
