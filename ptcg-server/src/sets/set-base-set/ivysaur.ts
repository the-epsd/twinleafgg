import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Ivysaur extends PokemonCard {

  public name = 'Ivysaur';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public fullName = 'Ivysaur BS';

  public cardType = CardType.GRASS;

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Bulbasaur';

  public hp = 60;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public setNumber: string = '30';

  public attacks: Attack[] = [
    {
      name: 'Vine Whip',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Poisonpowder',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: 20,
      text: 'The Defending Pokémon is now Poisoned.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      return store.reduceEffect(state, condition);
    }
    return state;
  }

}
