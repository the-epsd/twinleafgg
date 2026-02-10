import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Tympole extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Spiral Drain',
      cost: [W, C],
      damage: 20,
      text: 'Heal 20 damage from this Pokemon.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tympole';
  public fullName: string = 'Tympole DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spiral Drain - heal 20 damage from this Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}
