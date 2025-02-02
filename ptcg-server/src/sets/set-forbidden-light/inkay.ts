import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Inkay extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];
  public evolvesInto = 'Malamar';

  public attacks = [{
    name: 'Hypnosis',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Asleep.'
  }];

  public set: string = 'FLI';
  public name: string = 'Inkay';
  public fullName: string = 'Inkay FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}