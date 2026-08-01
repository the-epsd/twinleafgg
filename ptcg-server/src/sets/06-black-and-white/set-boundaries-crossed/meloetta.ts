import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BONUS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Meloetta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Psychic',
    cost: [P],
    damage: 10,
    damageCalculation: '+',
    text: 'Does 20 more damage for each Energy attached to the Defending Pokémon.'
  },
  {
    name: 'Echoed Voice',
    cost: [P, C, C],
    damage: 50,
    text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 50 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'BCR';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Meloetta';
  public fullName: string = 'Meloetta BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const defendingEnergy = effect.opponent.active.cards.filter(c => c.superType === SuperType.ENERGY).length;
      effect.damage += defendingEnergy * 20;
    }

    // Echoed Voice
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[1],
      source: this,
      bonusDamage: 50,
    });

    return state;
  }
}
