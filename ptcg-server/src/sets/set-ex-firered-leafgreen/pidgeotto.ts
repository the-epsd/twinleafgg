import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { GameError, GameMessage } from '../../game';
import { RetreatEffect } from '../../game/store/effects/game-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Pidgeotto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pidgey';
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Clutch',
    cost: [C],
    damage: 10,
    text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
  },
  {
    name: 'Cutting Wind',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Pidgeotto';
  public fullName: string = 'Pidgeotto RG';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, opponent.active, this);
    }

    if (effect instanceof RetreatEffect && HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, effect.player.active, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }

}