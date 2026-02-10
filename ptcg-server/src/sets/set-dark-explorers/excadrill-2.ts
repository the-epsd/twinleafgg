import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Excadrill2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Drilbur';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Reinforced Drill',
      cost: [F, C, C],
      damage: 50,
      damageCalculation: '+',
      text: 'If this Pokémon has a Pokémon Tool card attached to it, this attack does 30 more damage.'
    },
    {
      name: 'Mach Claw',
      cost: [F, C, C, C],
      damage: 70,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Excadrill';
  public fullName: string = 'Excadrill DEX 57';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reinforced Drill - +30 damage if Tool attached
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.active.tools && player.active.tools.length > 0) {
        effect.damage += 30;
      }
    }

    // Mach Claw - ignore resistance
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}
