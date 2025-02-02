import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

// LOT Slowpoke 54 (https://limitlesstcg.com/cards/LOT/54)
export class Slowpoke extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    { name: 'Yawn', cost: [CardType.COLORLESS], damage: 0, text: 'Your opponent\'s Active Pokémon is now Asleep.' }
  ];

  public set: string = 'LOT';

  public setNumber = '54';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Slowpoke';

  public fullName: string = 'Slowpoke LOT';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      return store.reduceEffect(state, specialCondition);
    }

    return state;
  }

}