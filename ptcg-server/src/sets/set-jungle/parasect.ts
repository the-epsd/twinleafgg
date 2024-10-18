import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Parasect extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public evolvesFrom = 'Paras';

  public attacks = [{
    name: 'Sporte',
    cost: [CardType.GRASS, CardType.GRASS],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Slash',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '41';

  public name: string = 'Parasect';

  public fullName: string = 'Parasect JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}