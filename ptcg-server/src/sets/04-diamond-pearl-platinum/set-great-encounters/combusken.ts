import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS } from '../../../game/store/prefabs/attack-effects';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Torchic';
  public hp: number = 80;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Bulk Up',
    cost: [R],
    damage: 30,
    text: 'During your next turn, each of Combusken\'s attacks does 30 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
  },
  {
    name: 'Double Kick',
    cost: [R, C, C],
    damage: 50,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Combusken';
  public fullName: string = 'Combusken GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bulk Up
    NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, {
      source: this,
      bonusDamage: 30,
      setupAttack: this.attacks[0],
    });

    // Double Kick
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        effect.damage = 50 * heads;
      });
    }

    return state;
  }
}
