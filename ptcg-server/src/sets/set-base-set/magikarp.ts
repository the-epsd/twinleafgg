import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Magikarp extends PokemonCard {

  public name = 'Magikarp';
  
  public set = 'BS';
  
  public fullName = 'Magikarp BS';
  
  public cardType = CardType.WATER;

  public stage = Stage.BASIC;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '35';
  
  public hp = 30;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    },
    {
      name: 'Flail',
      cost: [CardType.WATER],
      damage: 10,
      text: 'Does 10 damage times the number of damage counters on Magikarp.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.damage = effect.player.active.damage; 
    }
    return state;
  }

}
