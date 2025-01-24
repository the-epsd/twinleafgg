import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {StoreLike,State} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {AttackEffect} from '../../game/store/effects/game-effects';
import {PutDamageEffect} from '../../game/store/effects/attack-effects';

export class Bisharp extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pawniard';

  public cardType: CardType = CardType.DARK;

  public hp: number = 120;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { 
      name: 'Dark Cutter', 
      cost: [CardType.DARK], 
      damage: 40, 
      text: '' 
    },
    { 
      name: 'Double-Edged Slash', 
      cost: [CardType.DARK, CardType.COLORLESS], 
      damage: 120, 
      text: 'This Pokémon also does 30 damage to itself.' 
    }
  ];

  public set: string = 'SVI';

  public setNumber = '133';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Bisharp';

  public fullName: string = 'Bisharp SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]){
      const damageThatBoi = new PutDamageEffect(effect, 30);
      damageThatBoi.target = effect.player.active;
      store.reduceEffect(state, damageThatBoi);
    }

    return state;
  }

}
