import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Golurk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Golett';
  public cardType: CardType = P;
  public hp: number = 160;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Double Smash',
    cost: [C, C, C],
    damage: 80,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 80 damage for each heads.'
  }, {
    name: 'Golurk Hammer',
    cost: [P, P, C, C, C],
    damage: 200,
    text: ''
  }];

  public regulationMark = 'I';

  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Golurk';
  public fullName: string = 'Golurk SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Smash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(result => result).length;
        effect.damage = 80 * heads;
      });
    }

    return state;
  }
}
