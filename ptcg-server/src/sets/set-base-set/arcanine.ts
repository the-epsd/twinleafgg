import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Arcanine extends PokemonCard {

  public name = 'Arcanine';
  
  public set = 'BS';
  
  public fullName = 'Arcanine BS';
  
  public stage = Stage.STAGE_1;
  
  public evolvesFrom = 'Growlithe';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '23';

  public cardType = CardType.FIRE;
  
  public hp = 100;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Flamethrower',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 50,
      text: 'Discard 1 {R} Energy attached to Arcanine in order to use this attack.'
    },
    {
      name: 'Take Down',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 80,
      text: 'Arcanine does 30 damage to itself.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.FIRE, 1); 
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const damage = new DealDamageEffect(effect, 30);
      damage.target = effect.player.active;
      store.reduceEffect(state, damage);
    }
    return state;
  }

}
