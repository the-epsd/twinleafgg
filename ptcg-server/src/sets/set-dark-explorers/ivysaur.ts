import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Ivysaur extends PokemonCard {
  
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Bulbasaur';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Sleep Powder',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      text: 'The Defending Pokémon is now Asleep.',
    },
    {
      name: 'Poison Powder',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 80,
      text: 'The Defending Pokémon is now Poisoned.',
    }
  ];

  public set: string = 'DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name: string = 'Ivysaur';

  public fullName: string = 'Ivysaur DEX';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialCondition);
  
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialCondition);

    }
    return state;
  }
}