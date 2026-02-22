import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { ADD_MARKER, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, COIN_FLIP_PROMPT, PREVENT_DAMAGE_IF_TARGET_HAS_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Shelmet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Shell Hit',
    cost: [G, C],
    damage: 20,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage done to this Pokémon by attacks. '
  }];

  public set: string = 'JTG';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Shelmet';
  public fullName: string = 'Shelmet JTG';

  public readonly CLEAR_SHELL_HIT_MARKER = 'CLEAR_SHELL_HIT_MARKER';
  public readonly SHELL_HIT_MARKER = 'SHELL_HIT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result)
          return;
        ADD_MARKER(this.SHELL_HIT_MARKER, player.active, this);
        ADD_MARKER(this.CLEAR_SHELL_HIT_MARKER, opponent, this);
      });
    }

    PREVENT_DAMAGE_IF_TARGET_HAS_MARKER(effect, this.SHELL_HIT_MARKER, this);
    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_SHELL_HIT_MARKER, this.SHELL_HIT_MARKER, this);

    return state;
  }
}