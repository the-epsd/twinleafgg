import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, NEXT_TURN_ATTACK_BONUS, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Seismitoad extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Palpitoad';
  public cardType: CardType = W;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Echoed Voice',
      cost: [C, C, C],
      damage: 50,
      text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 50 more damage (before applying Weakness and Resistance).'
    },
    {
      name: 'Drain Punch',
      cost: [W, C, C, C],
      damage: 80,
      text: 'Heal 20 damage from this Pokémon.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Seismitoad';
  public fullName: string = 'Seismitoad DRX';

  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Echoed Voice - next turn bonus
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 50,
      bonusMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER,
      clearMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER_2
    });

    // Drain Punch - heal 20
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}
