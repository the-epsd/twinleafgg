import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class Conkeldurr extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gurdurr';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Chip Away',
    cost: [F],
    damage: 40,
    text: 'This attack\'s damage isn\'t affected by any effects on the Defending Pokémon.'
  }, {
    name: 'Swing Around',
    cost: [F, F, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Flip 2 coins. This attack does 30 more damage for each heads.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Conkeldurr';
  public fullName: string = 'Conkeldurr NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 40);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage += 30 * heads;
      });
    }
    return state;
  }
}
