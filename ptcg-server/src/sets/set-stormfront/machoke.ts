import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE, THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class Machoke extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Machop';
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: P, value: 20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Steady Punch',
      cost: [F],
      damage: 20,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.',
    },
    {
      name: 'Brick Break',
      cost: [F, C],
      damage: 30,
      shredAttack: true,
      text: 'This attack\'s damage isn\'t affected by Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.',
    }
  ];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Machoke';
  public fullName: string = 'Machoke SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Steady Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    // Brick Break
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 60);
    }

    return state;
  }
}