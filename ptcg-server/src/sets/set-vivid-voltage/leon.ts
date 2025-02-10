import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { ADD_MARKER, HAS_MARKER, PUT_DAMAGE, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { GameError, GameMessage, StateUtils } from '../../game';

export class Leon extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'VIV';
  public name: string = 'Leon';
  public fullName: string = 'Leon VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '154';
  public text: string = 'During this turn, your Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
  private readonly LEON_MARKER = 'LEON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      supporterTurn == 1;

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      ADD_MARKER(this.LEON_MARKER, player, this);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    if (PUT_DAMAGE(effect) && HAS_MARKER(this.LEON_MARKER, effect.player, this) && effect.damage > 0) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      effect.damage += 30;
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.LEON_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.LEON_MARKER, effect.player, this);
    }
    return state;
  }
}
