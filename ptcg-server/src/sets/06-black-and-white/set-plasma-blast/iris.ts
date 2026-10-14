import { GameError, GameMessage, Player, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Iris extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'PLB';
  public setNumber: string = '81';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Iris';
  public fullName: string = 'Iris PLB';
  public text: string =
    "During this turn, your Pokémon's attacks do 10 more damage to the Active Pokémon for each Prize card your opponent has taken (before applying Weakness and Resistance). You may play only 1 Supporter card during your turn (before your attack).";

  public readonly IRIS_MARKER = 'IRIS_MARKER';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }
      player.marker.addMarker(this.IRIS_MARKER, this);
    }

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;

      if (!player.marker.hasMarker(this.IRIS_MARKER, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target !== opponent.active) {
        return state;
      }

      const prizesTaken = opponent.prizesTaken;

      if (prizesTaken > 0) {
        effect.damage += 10 * prizesTaken;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.IRIS_MARKER, this);
    }

    return state;
  }
}
