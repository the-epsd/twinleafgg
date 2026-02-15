import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BASE_DAMAGE } from '../../game/store/prefabs/prefabs';

export class Skorupi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public readonly HONE_CLAWS_MARKER = 'SKORUPI_UPR_HONE_CLAWS_MARKER';
  public readonly HONE_CLAWS_CLEAR_MARKER = 'SKORUPI_UPR_HONE_CLAWS_CLEAR_MARKER';

  public attacks = [
    {
      name: 'Hone Claws',
      cost: [P],
      damage: 0,
      text: 'During your next turn, this Pokémon\'s Pierce attack\'s base damage is 90.'
    },
    {
      name: 'Pierce',
      cost: [P, P],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Skorupi';
  public fullName: string = 'Skorupi UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Hone Claws
    // Ref: set-burning-shadows/sneasel.ts (Hone Claws - NEXT_TURN_ATTACK_BASE_DAMAGE)
    NEXT_TURN_ATTACK_BASE_DAMAGE(effect, {
      setupAttack: this.attacks[0],
      boostedAttack: this.attacks[1],
      source: this,
      baseDamage: 90,
      bonusMarker: this.HONE_CLAWS_MARKER,
      clearMarker: this.HONE_CLAWS_CLEAR_MARKER
    });

    return state;
  }
}
