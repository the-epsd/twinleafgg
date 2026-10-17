import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Cacturne extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cacnea';
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Pin Missile',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
  },
  {
    name: 'Needle Arm',
    cost: [D, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If the Defending Pokémon already has any damage counters on it, this attack does 50 damage plus 20 more damage.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Cacturne';
  public fullName: string = 'Cacturne GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pin Missile
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 20 * heads;
      });
    }

    // Needle Arm
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.damage > 0) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
