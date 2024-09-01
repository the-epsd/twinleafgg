import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';


export class RegigigasV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 240;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Hammer In',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: ''
    },
    {
      name: 'Angry Whack',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      damageCalculator: '+',
      text: 'This attack does 10 more damage for each damage counter on this Pokémon. This Pokémon is now Confused.'
    },
  ];

  public set: string = 'CRZ';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';

  public name: string = 'Regigigas V';

  public fullName: string = 'Regigigas V CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.player.active.damage;
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      specialConditionEffect.target = effect.player.active;
      store.reduceEffect(state, specialConditionEffect);
      return state;
    }
    return state;
  }
}