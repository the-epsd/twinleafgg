import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, PREVENT_DAMAGE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pineco extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 10,
    text: ''
  }, {
    name: 'Iron Defense',
    cost: [C, C],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage done to this Pokémon by attacks.'
  }];

  public regulationMark: string = 'D';

  public set: string = 'VIV';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pineco';
  public fullName: string = 'Pineco VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Iron Defense
    // Ref: set-astral-radiance/hisuian-growlithe.ts (Defensive Posture)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
