import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BASE_DAMAGE_EFFECT } from '../../game/store/prefabs/prefabs';

export class Scyther extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public attacks =
    [
      {
        name: 'Swords Dance',
        cost: [CardType.GRASS],
        damage: 0,
        text: 'During your next turn, Scyther\'s Slash attack\'s base damage is 60 instead of 30.'
      },
      {
        name: 'Slash',
        cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
        damage: 30,
        text: ''
      }
    ];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '10';

  public name: string = 'Scyther';

  public fullName: string = 'Scyther JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    NEXT_TURN_ATTACK_BASE_DAMAGE_EFFECT(effect, {
      setupAttack: this.attacks[0],
      boostedAttack: this.attacks[1],
      source: this,
      baseDamage: 60,
    });

    return state;
  }
}
