import { CardType, PokemonCard, PowerType, Stage, State, StoreLike } from '../../../game';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { reduceIncarnateUnionEffect } from './incarnate-union';

export class Thundurus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C];

  public powers = [{
    name: 'Incarnate Union',
    powerType: PowerType.ABILITY,
    text: 'If you have Tornadus, Thundurus, Landorus, and Enamorus in play, ignore all [C] Energy in the cost of attacks used by this Pokémon.',
  }];

  public attacks = [{
    name: 'Thunder Edge',
    cost: [L, C, C],
    damage: 90,
    text: 'Ignore all effects on your opponent\'s Active Pokémon for this attack\'s damage.',
  }];

  public regulationMark: string = 'J';
  public set: string = 'M6';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Thundurus';
  public fullName: string = 'Thundurus M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-furious-fists/politoed.ts (King's Song - CheckAttackCostEffect Colorless removal)
    if (effect instanceof CheckAttackCostEffect) {
      return reduceIncarnateUnionEffect(store, state, effect, this);
    }

    // Ref: set-neo-discovery/yanma.ts (Sonicboom)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 90);
    }

    return state;
  }
}
