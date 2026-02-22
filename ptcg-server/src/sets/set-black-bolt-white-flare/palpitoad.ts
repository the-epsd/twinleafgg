import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
// Energy type constants (W, C, L) are assumed to be globally available as in other SV11B cards

export class Palpitoad extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tympole';
  public cardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Round',
    cost: [C, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'This attack does 40 damage for each of your Pokémon in play that has the Round attack.'
  },
  {
    name: 'Wave Splash',
    cost: [W, C, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Palpitoad';
  public fullName: string = 'Palpitoad SV11B';

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