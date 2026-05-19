import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ChiYu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Spiraling Envy',
    cost: [D],
    damage: 20,
    damageCalculation: '+',
    text: 'If this Pokémon has 2 or more damage counters on it, this attack does 90 more damage. Don\'t apply Weakness for this attack\'s damage.',
  }];

  public set: string = 'M5';
  public setNumber: string = '57';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chi-Yu';
  public fullName: string = 'Chi-Yu M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spiraling Envy
    // Ref: set-unified-minds/honedge-2.ts (ignoreWeakness), set-destined-rivals/cynthias-spiritomb.ts (bonus + ignoreWeakness)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreWeakness = true;
      if (effect.player.active.damage >= 20) {
        effect.damage += 90;
      }
    }

    return state;
  }
}
