import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BONUS } from '../../../game/store/prefabs/prefabs';

export class Pawniard extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Swords Dance',
    cost: [C],
    damage: 0,
    text: 'During your next turn, this Pokémon\'s Slash attack does 70 more damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Slash',
    cost: [M],
    damage: 10,
    text: ''
  }];

  public regulationMark: string = 'E';
  public set: string = 'BST';
  public setNumber: string = '103';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pawniard';
  public fullName: string = 'Pawniard BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Swords Dance
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[1],
      source: this,
      bonusDamage: 70
    });

    return state;
  }
}
