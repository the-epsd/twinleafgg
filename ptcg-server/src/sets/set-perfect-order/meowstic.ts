import { PokemonCard, Stage, CardType, SuperType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Meowstic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Espurr';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Perplex',
    cost: [P],
    damage: 0,
    text: 'Your opponent\'s Active Pokemon is now Confused.'
  },
  {
    name: 'Psychic',
    cost: [P],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Meowstic';
  public fullName: string = 'Meowstic M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Perplex - confuse opponent's Active Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    // Psychic - damage based on opponent's energy
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const energyCount = opponent.active.cards.filter(card =>
        card.superType === SuperType.ENERGY
      ).length;
      effect.damage = 30 + (energyCount * 30);
    }

    return state;
  }
}
