import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Machoke extends PokemonCard {

  public name = 'Machoke';

  public set = 'BS';
  
  public fullName = 'Machoke BS';
  
  public cardType = CardType.FIGHTING;
  
  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Machop';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '34';

  public hp = 80;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Karate Chop',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 50,
      text: 'Does 50 damage minus 10 damage for each damage counter on Machoke.'
    },
    {
      name: 'Submission',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: 'Machoke does 20 damage to itself.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const damage = Math.max(50 - player.active.damage, 0);
      effect.damage = damage;
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const damage = new DealDamageEffect(effect, 20);
      damage.target = effect.player.active;
      store.reduceEffect(state, damage);
    }

    return state;
  }

}
