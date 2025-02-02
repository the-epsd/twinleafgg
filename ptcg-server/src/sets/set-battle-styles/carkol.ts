import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Carkol extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 70;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Rolycoly';

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: ''
    },
    {
      name: 'Wild Tackle',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: 'This pokemon also does 10 damage to itself.'
    }
  ];

  public regulationMark: string = 'E';
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Carkol';
  public fullName: string = 'Carkol BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
