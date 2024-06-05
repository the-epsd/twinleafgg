import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Misdreavus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [ CardType.PSYCHIC ],
    damage: 0,
    text: 'Your opponent\'s Active Pokemon is now Confused.'
  }];

  public set: string = 'CIN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Misdreavus';
  public fullName: string = 'Misdreavus CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if(effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}