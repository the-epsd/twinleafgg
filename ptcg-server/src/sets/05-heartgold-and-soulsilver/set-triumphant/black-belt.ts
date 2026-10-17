import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class BlackBelt extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Black Belt';
  public fullName: string = 'Black Belt TM';
  public text: string =
    'You may use this card only if you have more Prize cards left than your ' +
    "opponent. During this turn, each of your Active Pokemon's attacks does " +
    "40 more damage to your opponent's Active Pokemon (before applying " +
    'Weakness and Resistance).';

  public readonly BLACK_BELT_MARKER = 'BLACK_BELT_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const opponent = StateUtils.getOpponent(state, player);
    if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      player.marker.addMarker(this.BLACK_BELT_MARKER, this);
    }

    if (
      effect instanceof DealDamageEffect &&
      effect.player.marker.hasMarker(this.BLACK_BELT_MARKER, this) &&
      effect.damage > 0 &&
      effect.source === effect.player.active &&
      effect.target === StateUtils.getOpponent(state, effect.player).active
    ) {
      effect.damage += 40;
    }

    if (
      effect instanceof EndTurnEffect &&
      effect.player.marker.hasMarker(this.BLACK_BELT_MARKER, this)
    ) {
      effect.player.marker.removeMarker(this.BLACK_BELT_MARKER, this);
    }

    return state;
  }
}
