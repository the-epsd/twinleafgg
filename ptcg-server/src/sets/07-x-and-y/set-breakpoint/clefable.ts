import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class Clefable extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Clefairy';
  public cardType: CardType[] = [Y];
  public hp: number = 100;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Moon Barrier',
    cost: [Y],
    damage: 30,
    text: 'During your opponent\'s next turn, prevent all effects of attacks, including damage, done to this Pokémon by [N] Pokémon.'
  },
  {
    name: 'Tumbling Attack',
    cost: [Y, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 more damage.'
  }];

  public set: string = 'BKP';
  public setNumber: string = '82';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Clefable';
  public fullName: string = 'Clefable BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Moon Barrier
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const options = { sourceCardTypes: [CardType.DRAGON] };
      PREVENT_DAMAGE(store, state, effect, this, options);
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this, options);
    }

    // Tumbling Attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
    }

    return state;
  }
}
