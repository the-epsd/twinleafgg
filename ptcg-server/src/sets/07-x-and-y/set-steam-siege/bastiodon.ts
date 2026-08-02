import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/prefabs';

export class Bastiodon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shieldon';
  public cardType: CardType = M;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Counter Head',
    cost: [C, C],
    damage: 0,
    text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if this Pokémon is Knocked Out), put damage counters on the Attacking Pokémon equal to the damage done to this Pokémon.'
  },
  {
    name: 'Fortress of Rage',
    cost: [M, M, C, C],
    damage: 100,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each of your Benched Pokémon that has any damage counters on it.'
  }];

  public set: string = 'STS';
  public setNumber: string = '70';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bastiodon';
  public fullName: string = 'Bastiodon STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, { reflect: true });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let damagedBenchCount = 0;
      player.bench.forEach(benched => {
        if (benched.cards.length > 0 && benched.damage > 0) {
          damagedBenchCount++;
        }
      });
      effect.damage += 10 * damagedBenchCount;
    }

    return state;
  }
}
