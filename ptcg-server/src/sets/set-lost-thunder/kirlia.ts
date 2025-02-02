import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

// LOT Kirlia 140 (https://limitlesstcg.com/cards/LOT/140)
export class Kirlia extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ralts';

  public cardType: CardType = CardType.FAIRY;

  public hp: number = 80;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [{ type: CardType.DARK, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Beat', cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: '' },
    { name: 'Disarming Voice', cost: [CardType.FAIRY, CardType.COLORLESS, CardType.COLORLESS], damage: 50, text: 'Your opponent\'s Active Pokémon is now Confused. ' },
  ];

  public set: string = 'LOT';

  public setNumber = '140';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Kirlia';

  public fullName: string = 'Kirlia LOT';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      return store.reduceEffect(state, specialCondition);
    }

    return state;
  }

}