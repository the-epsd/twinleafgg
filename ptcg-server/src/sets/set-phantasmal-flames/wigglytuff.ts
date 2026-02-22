import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wigglytuff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Jigglypuff';
  public cardType: CardType = C;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Round',
    cost: [C, C],
    damage: 0,
    damageCalculation: 'x',
    text: 'This attack does 40 damage for each of your Pokemon in play that has the Round attack.'
  }, {
    name: 'Seismic Toss',
    cost: [C, C, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Wigglytuff';
  public fullName: string = 'Wigglytuff M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let pokemonCount = 0;
      player.bench.forEach(c => {
        if (c instanceof PokemonCard && c.attacks.some(a => a.name === 'Round')) {
          pokemonCount += 1;
        }
      });
      if (player.active.getPokemonCard()?.attacks.some(a => a.name === 'Round')) {
        pokemonCount += 1;
      }
      effect.damage = pokemonCount * 40;
    }

    return state;
  }
}

