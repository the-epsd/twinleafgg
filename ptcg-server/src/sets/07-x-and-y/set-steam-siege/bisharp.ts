import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';

export class Bisharp extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pawniard';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Retaliate',
    cost: [C],
    damage: 30,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s attack during his or her last turn, this attack does 60 more damage.'
  },
  {
    name: 'Mach Claw',
    cost: [D, C],
    damage: 60,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public set: string = 'STS';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bisharp';
  public fullName: string = 'Bisharp STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Retaliate
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(player, { byAttackDamage: true })) {
        effect.damage += 60;
      }
    }

    // Mach Claw
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}