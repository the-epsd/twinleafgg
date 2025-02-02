import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class TapuKoko extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 110;

  public retreat: CardType[] = [];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public attacks = [
    {
      name: 'Flying Flip',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'SMP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'SM30';
  public name: string = 'Tapu Koko';
  public fullName: string = 'Tapu Koko SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      effect.damage = 20;

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });

      return state;
    }

    return state;
  }
}
