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

export class HexManiac extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'AOR';

  public setNumber = '75';

  public name: string = 'Hex Maniac';

  public fullName: string = 'Hex Maniac AOR';

  public cardImage: string = 'assets/cardback.png';

  public text: string =
    'Until the end of your opponent\'s next turn, each Pokémon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities. (This includes cards that come into play on that turn.)';

  public HEX_MANIAC_MARKER = 'HEX_MANIAC_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      ADD_MARKER(this.HEX_MANIAC_MARKER, player, this);
      ADD_MARKER(this.HEX_MANIAC_MARKER, opponent, this);

      MOVE_CARD_TO(state, effect.trainerCard, player.discard);
    }

    if (effect instanceof PowerEffect && HAS_MARKER(this.HEX_MANIAC_MARKER, effect.player, this)
      && (effect.power.powerType === PowerType.ABILITY)) {

      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const owner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));

      if (player !== owner) {
        REMOVE_MARKER(this.HEX_MANIAC_MARKER, player, this);
        REMOVE_MARKER(this.HEX_MANIAC_MARKER, opponent, this);
      }
    }

    return state;

  }
}