import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Mienfoo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Triple Smash',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 10 times the number of heads.'
  }];

  public set: string = 'NXD';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mienfoo';
  public fullName: string = 'Mienfoo NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 10 * heads;
      });
    }
    return state;
  }
}
