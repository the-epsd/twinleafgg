import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Palafin extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = W;
  public hp: number = 150;
  public weakness = [{ type: L }];
  public retreat = [C, C];
  public evolvesFrom = 'Finizen';

  public attacks = [{
    name: 'Vanguard Punch',
    cost: [W],
    damage: 130,
    text: 'This Pokémon also does 10 damage to itself for each damage counter on it.'
  }, {
    name: 'Double Hit',
    cost: [W, C, C],
    damage: 90,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 90 damage for each heads.'
  }];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Palafin';
  public fullName: string = 'Palafin TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const selfDamage = player.active.damage;

      const dealDamage = new DealDamageEffect(effect, selfDamage);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 90 * heads;
      });
    }

    return state;
  }
}