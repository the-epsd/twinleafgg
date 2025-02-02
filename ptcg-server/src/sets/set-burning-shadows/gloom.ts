import { PokemonCard, Stage, CardType, Resistance, StoreLike, State, SpecialCondition } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Gloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Oddish';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 80;
  public weakness = [{ type: CardType.FIRE }];
  public resistance: Resistance[] = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Stinky Scent',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    },
    {
      name: 'Razor Leaf',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'BUS';

  public name: string = 'Gloom';

  public fullName: string = 'Gloom BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}