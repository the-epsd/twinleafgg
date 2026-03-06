import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils } from '../../game';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

export class Flaaffy extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mareep';
  public hp: number = 90;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Disconnect',
    cost: [L, C],
    damage: 40,
    text: 'During your opponent\'s next turn, your opponent can\'t play any Item cards from their hand.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Flaaffy';
  public fullName: string = 'Flaaffy M4';

  public readonly DISCONNECT_MARKER = 'FLAAFFY_M4_DISCONNECT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      ADD_MARKER(this.DISCONNECT_MARKER, opponent, this);
    }
    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      if (HAS_MARKER(this.DISCONNECT_MARKER, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DISCONNECT_MARKER, this);
    return state;
  }
}
