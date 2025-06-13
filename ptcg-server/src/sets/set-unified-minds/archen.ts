import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Archen extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Unidentified Fossil';
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Endeavor',
    cost: [C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '120';
  public name: string = 'Archen';
  public fullName: string = 'Archen UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage += 20 * heads;
      });
    }

    return state;
  }
}