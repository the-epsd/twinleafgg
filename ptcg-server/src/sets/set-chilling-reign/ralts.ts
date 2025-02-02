import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Ralts extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'CRE';
  public name: string = 'Ralts';
  public fullName: string = 'Ralts CRE';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialCondition);

    }

    return state;
  }
}