import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Kyogre extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Amazing Surge',
    cost: [W, L, M, C],
    damage: 0,
    text: 'This attack does 80 damage to each of your opponent\’s Pokémon. (Don\’t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SHF';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Kyogre';
  public fullName: string = 'Kyogre SHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 80);
      store.reduceEffect(state, activeDamageEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 80);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}