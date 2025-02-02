import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class DarkraiV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 210;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Wind of Darkness',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 50,
      text: ''
    },
    {
      name: 'Dark Void',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 130,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '98';

  public name: string = 'Darkrai V';

  public fullName: string = 'Darkrai V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}