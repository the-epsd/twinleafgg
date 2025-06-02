import { CardTag, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Trapinch extends PokemonCard {
  public cardType = G;
  public stage = Stage.BASIC;
  public evolvesFrom = 'Trapinch';
  public tags = [CardTag.DELTA_SPECIES];
  public hp = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Big Bite',
    cost: [G],
    damage: 10,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Mud Slap',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set = 'HP';
  public setNumber = '84';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Trapinch';
  public fullName = 'Trapinch HP';

  public readonly BIG_BITE_MARKER: string = 'BIG_BITE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.BIG_BITE_MARKER, opponent.active, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, this.BIG_BITE_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.BIG_BITE_MARKER, this);

    return state;
  }
}