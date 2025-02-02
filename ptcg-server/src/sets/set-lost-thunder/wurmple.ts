import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Wurmple extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Poison Sting',
    cost: [CardType.GRASS],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Wurmple';
  public fullName: string = 'Wurmple LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}