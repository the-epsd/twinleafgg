import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { StateUtils } from '../../game';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, FLIP_COIN_TO_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Metapod extends PokemonCard {
  public name = 'Metapod';
  public setNumber = '54';
  public set = 'BS';
  public fullName = 'Metapod BS';

  public cardType = G;
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Caterpie';
  public hp = 70;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks: Attack[] = [
    {
      name: 'Stiffen',
      cost: [C, C],
      text: 'Flip a coin. If heads, prevent all damage done to Metapod during your opponent\'s next turn. (Any other effects of attacks still happen.)',
      damage: 0
    },
    {
      name: 'Stun Spore',
      cost: [G, G],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    return state;
  }

}
