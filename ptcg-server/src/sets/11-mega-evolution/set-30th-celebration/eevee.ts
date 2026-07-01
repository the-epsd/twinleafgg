import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Eevee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Quick Attack',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip 2 coins. If heads, this attack does 20 more damage.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-fates-collide/binacle.ts (Swing Around — flip 2 coins for bonus damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        if (results.some(r => r)) {
          effect.damage += 20;
        }
      });
    }
    return state;
  }
}
