import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Spinda extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Dizzying Spin',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'This attack does 10 damage to each of your opponent\'s Pokémon.Your opponent\'s Active Pokémon is now Confused. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set = 'SIT';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '141';
  public name = 'Spinda';
  public fullName = 'Spinda SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 10);
      store.reduceEffect(state, activeDamageEffect);

      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}