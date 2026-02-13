import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BASE_DAMAGE } from '../../game/store/prefabs/prefabs';

export class Cubchoo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Sniffle',
      cost: [W],
      damage: 0,
      text: 'During your next turn, this Pokémon\'s Belt attack\'s base damage is 40.'
    },
    {
      name: 'Belt',
      cost: [W, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cubchoo';
  public fullName: string = 'Cubchoo NXD';

  public readonly SNIFFLE_MARKER = 'SNIFFLE_MARKER';
  public readonly SNIFFLE_CLEAR_MARKER = 'SNIFFLE_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Refs: set-jungle/scyther.ts (Swords Dance), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BASE_DAMAGE)
    NEXT_TURN_ATTACK_BASE_DAMAGE(effect, {
      setupAttack: this.attacks[0],
      boostedAttack: this.attacks[1],
      source: this,
      baseDamage: 40,
      bonusMarker: this.SNIFFLE_MARKER,
      clearMarker: this.SNIFFLE_CLEAR_MARKER
    });

    return state;
  }
}
