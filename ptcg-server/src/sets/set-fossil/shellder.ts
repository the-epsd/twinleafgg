import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, PREVENT_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Shellder extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 30;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Supersonic',
    cost: [W],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }, {
    name: 'Hide in Shell',
    cost: [W],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Shellder during your opponent\'s next turn. (Any other effects of attacks still happen.)'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Shellder';
  public fullName: string = 'Shellder FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hide in Shell
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
