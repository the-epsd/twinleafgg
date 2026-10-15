import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BASE_DAMAGE } from '../../../game/store/prefabs/attack-effects';
import { THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Shelgon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bagon';
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: C, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Focus Energy',
    cost: [C],
    damage: 0,
    text: 'During your next turn, Shelgon\'s Protect Charge attack\'s base damage is 80.'
  },
  {
    name: 'Protect Charge',
    cost: [C, C, C],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done to Shelgon by attacks is reduced by 30 (after applying Weakness and Resistance).'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Shelgon';
  public fullName: string = 'Shelgon SW';

  public readonly FOCUS_ENERGY_MARKER = 'FOCUS_ENERGY_MARKER';
  public readonly FOCUS_ENERGY_CLEAR_MARKER = 'FOCUS_ENERGY_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Focus Energy
    NEXT_TURN_ATTACK_BASE_DAMAGE(effect, {
      setupAttack: this.attacks[0],
      boostedAttack: this.attacks[1],
      source: this,
      baseDamage: 80,
      bonusMarker: this.FOCUS_ENERGY_MARKER,
      clearMarker: this.FOCUS_ENERGY_CLEAR_MARKER,
    });

    // Protect Charge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 30);
    }

    return state;
  }
}
