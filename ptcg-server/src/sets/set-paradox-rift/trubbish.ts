import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Trubbish extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = D;

  public hp: number = 70;

  public weakness = [{ type: F }];

  public retreat = [C, C];

  public attacks = [
    { name: 'Suffocating Gas', cost: [D], damage: 10, text: '' },
    {
      name: 'Venomous Hit',
      cost: [D, C, C],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Poisoned.'
    },
  ];

  public set: string = 'PAR';

  public name: string = 'Trubbish';

  public fullName: string = 'Trubbish PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '116';

  public regulationMark: string = 'G';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }

}
