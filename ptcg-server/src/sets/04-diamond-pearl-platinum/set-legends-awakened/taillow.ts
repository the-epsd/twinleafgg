import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BASE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class Taillow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Focus Energy',
    cost: [C],
    damage: 0,
    text: 'During your next turn, Taillow\'s Peck attack\'s base damage is 30.'
  },
  {
    name: 'Peck',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '124';
  public name: string = 'Taillow';
  public fullName: string = 'Taillow LA';

  public readonly FOCUS_ENERGY_MARKER = 'FOCUS_ENERGY_MARKER';
  public readonly FOCUS_ENERGY_CLEAR_MARKER = 'FOCUS_ENERGY_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    NEXT_TURN_ATTACK_BASE_DAMAGE(effect, {
      setupAttack: this.attacks[0],
      boostedAttack: this.attacks[1],
      source: this,
      baseDamage: 30,
      bonusMarker: this.FOCUS_ENERGY_MARKER,
      clearMarker: this.FOCUS_ENERGY_CLEAR_MARKER,
    });

    return state;
  }
}
