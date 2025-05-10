import { GameError, GameMessage, PowerType, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, MOVE_CARD_TO, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class GoopGasAttack extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'TR';
  public setNumber = '78';
  public name: string = 'Goop Gas Attack';
  public fullName: string = 'Goop Gas Attack TR';
  public cardImage: string = 'assets/cardback.png';
  public text: string = 'All Pokémon Powers stop working until the end of your opponent\'s next turn.';

  public GOOP_GAS_MARKER = 'GOOP_GAS_MARKER';
  public GOOP_GAS_MARKER_2 = 'GOOP_GAS_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      ADD_MARKER(this.GOOP_GAS_MARKER, player, this);
      ADD_MARKER(this.GOOP_GAS_MARKER, opponent, this);

      MOVE_CARD_TO(state, effect.trainerCard, player.discard);
    }

    if (effect instanceof PowerEffect && HAS_MARKER(this.GOOP_GAS_MARKER, effect.player, this)
      && (effect.power.powerType === PowerType.POKEPOWER)) {

      throw new GameError(GameMessage.ABILITY_BLOCKED);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const owner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));

      if (player !== owner) {
        REMOVE_MARKER(this.GOOP_GAS_MARKER, player, this);
        REMOVE_MARKER(this.GOOP_GAS_MARKER, opponent, this);
        console.log('Opponent end turn, markers removed');
      }
    }

    return state;

  }
}