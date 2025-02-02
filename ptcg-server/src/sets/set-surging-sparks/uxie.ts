import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Uxie extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Painful Memories',
      cost: [P],
      damage: 0,
      text: 'Put 2 damage counters on each of your opponent\'s Pokémon.'
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '78';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Uxie';
  public fullName: string = 'Uxie SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = effect.opponent;

      const activeDamageEffect = new PutCountersEffect(effect, 20);
      activeDamageEffect.target = opponent.active;
      store.reduceEffect(state, activeDamageEffect);

      opponent.bench.forEach((bench, index) => {
        if (bench.cards.length > 0) {
          const damageEffect = new PutCountersEffect(effect, 20);
          damageEffect.target = bench;
          store.reduceEffect(state, damageEffect);
        }
      });
    }
    return state;
  }
}
