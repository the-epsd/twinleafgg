import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK } from '../../game/store/prefabs/attack-effects';


export class Accelgor extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shelmet';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [];

  public attacks = [{
    name: 'Hammer In',
    cost: [CardType.GRASS],
    damage: 20,
    text: ''
  }, {
    name: 'Deck and Cover',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    text: 'The Defending Pokemon is now Paralyzed and Poisoned. Shuffle this ' +
      'Pokemon and all cards attached to it into your deck.'
  }];

  public set: string = 'DEX';

  public name: string = 'Accelgor';

  public fullName: string = 'Accelgor DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '11';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Deck and Cover - apply special conditions during attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const addSpecialCondition = new AddSpecialConditionsEffect(effect, [
        SpecialCondition.PARALYZED,
        SpecialCondition.POISONED
      ]);
      store.reduceEffect(state, addSpecialCondition);
    }

    // Deck and Cover - shuffle self into deck after attack
    if (AFTER_ATTACK(effect, 1, this)) {
      return SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
    }

    return state;
  }

}
