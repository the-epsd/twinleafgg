import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Rolycoly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 70;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Reckless Charge',
      cost: [CardType.FIGHTING],
      damage: 30,
      text: 'This Pokemon also does 10 damage to itself.'
    }
  ];

  public regulationMark: string = 'E';
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Rolycoly';
  public fullName: string = 'Rolycoly BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    
    return state;
  }
}
