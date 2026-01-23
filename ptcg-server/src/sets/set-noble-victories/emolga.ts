import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { SuperType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Emolga extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [
    {
      name: 'Static Shock',
      cost: [L],
      damage: 20,
      text: ''
    },
    {
      name: 'Electrichain',
      cost: [L, C, C],
      damage: 40,
      text: 'If the Defending Pokemon has any Energy attached to it, this attack does 20 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Emolga';
  public fullName: string = 'Emolga NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Electrichain
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if defending Pokemon has energy attached
      const hasEnergy = opponent.active.cards.some(c => c.superType === SuperType.ENERGY);

      if (hasEnergy) {
        const hasBenched = opponent.bench.some(b => b.cards.length > 0);
        if (hasBenched) {
          THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
        }
      }
    }

    return state;
  }
}
