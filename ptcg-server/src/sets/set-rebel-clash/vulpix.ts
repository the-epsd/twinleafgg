import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Vulpix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 60;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [CardType.FIRE],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  },
  {
    name: 'Smash Kick',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set = 'RCL';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name = 'Vulpix';
  public fullName = 'Vulpix RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}