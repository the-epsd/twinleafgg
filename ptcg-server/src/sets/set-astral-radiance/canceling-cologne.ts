import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage, StateUtils } from '../..';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { ADD_MARKER, HAS_MARKER, MOVE_CARD_TO, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class CancelingCologne extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'ASR';
  public name: string = 'Canceling Cologne';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '136';
  public fullName: string = 'Canceling Cologne ASR';
  public text: string = 'Until the end of your turn, your opponent\'s Active Pokémon has no Abilities. (This includes Pokémon that come into play during that turn.)';

  public CANCELING_COLOGNE_MARKER = 'CANCELING_COLOGNE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      ADD_MARKER(this.CANCELING_COLOGNE_MARKER, opponent, this);
      MOVE_CARD_TO(state, effect.trainerCard, player.discard);
    }

    if (effect instanceof CheckPokemonPowersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if Canceling Cologne marker is active on either player
      if (HAS_MARKER(this.CANCELING_COLOGNE_MARKER, player, this) || HAS_MARKER(this.CANCELING_COLOGNE_MARKER, opponent, this)) {
        // Filter out all abilities
        effect.powers = effect.powers.filter(power =>
          power.powerType !== PowerType.ABILITY
        );
      }
    }

    if (effect instanceof PowerEffect && HAS_MARKER(this.CANCELING_COLOGNE_MARKER, effect.player, this)
      && (effect.power.powerType === PowerType.ABILITY)) {

      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const owner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));

      if (player === owner) {
        REMOVE_MARKER(this.CANCELING_COLOGNE_MARKER, player, this);
        REMOVE_MARKER(this.CANCELING_COLOGNE_MARKER, opponent, this);
      }
    }

    return state;
  }
}