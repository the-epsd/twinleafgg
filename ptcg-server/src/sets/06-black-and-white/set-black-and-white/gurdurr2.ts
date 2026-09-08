import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS } from '../../../game/store/prefabs/attack-effects';

export class Gurdurr2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Timburr';
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Focus Energy',
    cost: [C],
    damage: 0,
    text: 'During your next turn, each of this Pokémon\'s attacks does 40 more damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Low Sweep',
    cost: [F, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Gurdurr';
  public fullName: string = 'Gurdurr BLW 60';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Focus Energy
    NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, {
      source: this,
      bonusDamage: 40,
      setupAttack: this.attacks[0],
    });

    return state;
  }
}
