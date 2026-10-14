import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import {
  APPLY_ABILITY_LOCK_MARKERS,
  CLEAR_ABILITY_LOCK_AT_END_OF_OPPONENTS_TURN,
  HANDLE_ABILITY_LOCK,
  HAS_ABILITY_LOCK_MARKER,
} from '../../../game/store/prefabs/ability-lock';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class HexManiac extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Hex Maniac';
  public fullName: string = 'Hex Maniac AOR';
  public text: string =
    "Until the end of your opponent's next turn, each Pokémon in play, in each player's hand, and in each player's discard pile has no Abilities. (This includes cards that come into play on that turn.)";

  public readonly HEX_MANIAC_MARKER = 'HEX_MANIAC_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      APPLY_ABILITY_LOCK_MARKERS(this.HEX_MANIAC_MARKER, this, player, opponent);
    }

    HANDLE_ABILITY_LOCK(effect, ({ player: lockPlayer }) =>
      HAS_ABILITY_LOCK_MARKER(this.HEX_MANIAC_MARKER, lockPlayer, this, state),
    );

    CLEAR_ABILITY_LOCK_AT_END_OF_OPPONENTS_TURN(effect, state, this.HEX_MANIAC_MARKER, this);

    return state;
  }
}
