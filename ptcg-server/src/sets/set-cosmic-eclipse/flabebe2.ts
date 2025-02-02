import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Flabebe2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 40;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Petal Blizzard',
    cost: [Y],
    damage: 0,
    text: 'This attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';
  public name: string = 'Flabébé';
  public fullName: string = 'Flabebe CEC 150';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 10);
      store.reduceEffect(state, activeDamageEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}