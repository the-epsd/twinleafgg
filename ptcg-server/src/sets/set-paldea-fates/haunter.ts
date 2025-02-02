import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Haunter extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Gastly';

  public cardType: CardType = CardType.DARK;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Dark Slumber',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 40,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    }
  ];

  public set: string = 'PAF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '56';

  public name: string = 'Haunter';

  public fullName: string = 'Haunter PAF';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialCondition);

    }
    return state;
  }
}