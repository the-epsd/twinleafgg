import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/prefabs';

export class RegisteelEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 180;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Triple Laser',
      cost: [C, C, C],
      damage: 0,
      text: 'This attack does 30 damage to 3 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    },
    {
      name: 'Protect Charge',
      cost: [M, M, C, C],
      damage: 80,
      text: 'During your opponent\'s next turn, any damage done to this Pokemon by attacks is reduced by 20 (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '81';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Registeel-EX';
  public fullName: string = 'Registeel-EX DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Triple Laser - 30 damage to 3 of opponent's Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state, 3, 3);
    }

    // Attack 2: Protect Charge - damage reduction during opponent's next turn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 20;
    }

    // Reduce incoming damage by 20
    

    

    // Cleanup markers at end of opponent's turn
    

    return state;
  }
}
