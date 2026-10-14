import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  StoreLike,
  State,
  StateUtils,
  GamePhase,
  Player,
} from '../../../game';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PlusPower extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'PlusPower';
  public fullName: string = 'PlusPower BLW';
  public text: string =
    "During this turn, your Pokemon's attacks do 10 more damage to the " +
    'Active Pokemon (before applying Weakness and Resistance).';

  public readonly PLUS_POWER_MARKER = 'PLUS_POWER_MARKER';

  public canPlay(_store: StoreLike, _state: State, _player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      player.marker.addMarker(this.PLUS_POWER_MARKER, this);
    }

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (
        player.marker.hasMarker(this.PLUS_POWER_MARKER, this) &&
        effect.damage > 0 &&
        effect.target === opponent.active
      ) {
        effect.damage += 10;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PLUS_POWER_MARKER, this);
    }

    return state;
  }
}
