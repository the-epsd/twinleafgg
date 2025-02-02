import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Magmar extends PokemonCard {

  public name = 'Magmar';
  
  public set = 'BS';
  
  public fullName = 'Magmar BS';
  
  public cardType = CardType.FIRE;

  public stage = Stage.BASIC;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';

  public hp = 50;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Fire Punch',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: 30,
      text: ''
    },
    {
      name: 'Flamethrower',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 50,
      text: 'Discard 1 {R} Energy attached to Magmar in order to use this attack.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.FIRE, 1);
    }
    
    return state;
  }

}
