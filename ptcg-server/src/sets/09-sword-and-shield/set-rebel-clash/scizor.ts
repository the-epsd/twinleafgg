import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Scizor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Scyther';
  public cardType: CardType = M;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Raid',
    cost: [M],
    damage: 30,
    damageCalculation: '+',
    text: 'If this Pokémon evolved from Scyther during this turn, this attack does 90 more damage.'
  },
  {
    name: 'Guard Claw',
    cost: [M, C, C],
    damage: 90,
    text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public regulationMark: string = 'D';
  public set: string = 'RCL';
  public setNumber: string = '128';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scizor';
  public fullName: string = 'Scizor RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Raid
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.active.pokemonPlayedTurn === state.turn) {
        effect.damage += 90;
      }
    }

    // Guard Claw
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    return state;
  }
}
